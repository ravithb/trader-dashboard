const config = require('config');
const pool = require('./lib/mysql-connection-pool');
const moment = require('moment');
const dbUtil = require('./lib/db-utils');
const args = process.argv;

if (args.length < 3) {
  console.log("import file name required. Usage `node import.js csv-file.csv`");
  process.exit();
}

const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const executeQuery = dbUtil.executeQueryCon;

let inputStream = fs.createReadStream(args[2], 'utf8');

async function truncateTables() {
  await new Promise((resolve, reject) => {
    pool.getConnection(async (conn_err, conn) => {
      if (conn_err) {
        reject_outer(conn_err);
        return;
      }
      try {
        await executeQuery(conn, "TRUNCATE TABLE trade_records_imported", []);
        await executeQuery(conn, "TRUNCATE TABLE trade_cumulative", []);
        resolve(true);
      } catch (e) {
        console.log(e);
        reject(e);
      } finally {
        conn.release();
      }
    });
  })
}

async function main() {

  await truncateTables();

  let promises = [];
  inputStream
    .pipe(new CsvReadableStream({
      parseNumbers: true,
      parseBooleans: true,
      trim: true,
      skipHeader: true
    }))
    .on('data', async function (row) {
      // console.log(row);
      try {
        let result = processRow(row);
        promises.push(result);

      } catch (e) {
        console.log(e);
      }
    })
    .on('end', async function (data) {
      console.log('No more rows!');
      await Promise.all(promises);
      await populateCumulative();
      process.exit();
    });

}



async function populateCumulative() {
  return new Promise((resolve_outer, reject_outer) => {
    pool.getConnection(async (conn_err, conn) => {
      if (conn_err) {
        reject_outer(conn_err);
        return;
      }
      try {
        let result = await executeQuery(conn, "SELECT * FROM trade_records WHERE processed_for_tc=0 ORDER BY date", []);

        for (let i in result) {
          await new Promise((resolve_inner, reject_inner) => {
            conn.beginTransaction(async (err) => {
              try {
                if (err) {
                  conn.rollback(() => {
                    // nothing to do
                  });
                  reject_inner(err);
                  return;
                }

                let result2 = await executeQuery(conn, "SELECT * FROM trade_cumulative WHERE code=?", [result[i]['code']]);

                // If the record does not exist in cumulative, add it.
                if (result2.length == 0) {

                  let break_even = (config.brokerageAud*2/result[i]['quantity'])+result[i]['price'];
                  await executeQuery(conn, "INSERT INTO trade_cumulative (code, quantity, cost_per_unit, total_cost, last_act, avg_price, break_even) VALUES (?,?,?,?,?,?,?)",
                    [result[i]['code'], result[i]['action_quantity'], result[i]['cost_per_unit'], result[i]['total_cost'], result[i]['action'], result[i]['price'], break_even
                    ]);

                  await executeQuery(conn, "UPDATE trade_records_imported SET processed_for_tc=?, pnl=? WHERE id=?",
                    [1, 0, result[i]['id']]);

                  conn.commit((err4) => {
                    if (err4) {
                      conn.rollback(() => {
                        //nothing to do
                      });
                      reject_inner(err4);
                    } else {
                      resolve_inner(true);
                    }
                  });

                } else {
                  let new_quantity = result[i]['action_quantity'] + result2[0]['quantity'];
                  let new_total_cost = result[i]['total_cost'] + result2[0]['total_cost'];
                  let new_cost_per_unit = (new_quantity > 0) ? (new_total_cost / new_quantity) : 0;
                  let avg_price = (result2[0]['quantity']*result2[0]['avg_price'] + result[i]['gross_total'])/(result2[0]['quantity']+result[i]['quantity']);
                  let break_even = (config.brokerageAud*2/(new_quantity))+avg_price;
                  let pnl = 0;
                  // no profit if action is the same.
                  if (result2[0]['last_act'] != result[i]['action']) {
                    pnl = (result2[0]['total_cost'] + result[i]['total_cost']) * -1;
                  }

                  if (new_quantity == 0) {
                    await executeQuery(conn, "DELETE FROM trade_cumulative WHERE id=?", [result2[0]['id']]);
                  } else {
                    await executeQuery(conn, "UPDATE trade_cumulative SET cost_per_unit=?,quantity=?,total_cost=?,avg_price=?,break_even=? WHERE id=?",
                      [new_cost_per_unit, new_quantity, new_total_cost, result2[0]['id'], avg_price, break_even]);
                  }

                  await executeQuery(conn, "UPDATE trade_records_imported SET processed_for_tc=?, pnl=? WHERE id=?",
                    [1, pnl, result[i]['id']]);

                  conn.commit((err7) => {
                    if (err7) {
                      conn.rollback(() => {
                        // nothing to do
                      });
                      reject_inner(err7);
                    } else {
                      resolve_inner(true);
                    }
                  });
                }
              } catch (e) {
                reject_inner(err7);
              }
            });
          });
        }

        resolve_outer(true);

      } catch (e) {
        reject_outer(e);
      } finally {
        conn.release();
      }

    });
  });
}

async function processRow(row) {
 
  return new Promise((resolve, reject) => {
    pool.query("SELECT COUNT(*) as c FROM trade_records WHERE order_id=?", [row[8]], async (error, result) => {

      if (error) {
        reject(error);
      }

      if (result.length == 1 && result[0]['c'] == 0 && row[5] > 0) {
        console.log("Processing row with id ", row[8]);
        let brokerage = config.brokerageAud;
        let act_quantity = (row[1] == 'Sell' ? -1.0 : 1.0) * row[5];
        let gross_total = (row[4] * 1 * act_quantity);
        let total_cost = (gross_total + brokerage).toFixed(4);
        let cost_per_unit = (total_cost * 1.0 / (row[3] * 1.0)).toFixed(4);
        gross_total = gross_total.toFixed(4);

        await new Promise((resolve2, reject2) => {
          pool.query("INSERT INTO trade_records_imported (`date`,`action`,`code`,`quantity`,`action_quantity`,`price`,`filled`,`order_id`,`gross_total`,`total_cost`,`cost_per_unit`,`brokerage`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              moment(row[0], "DD/MM/YYYY HH:mm:ss a").toDate(), row[1], row[2], row[3], act_quantity, row[4], row[5], row[8],gross_total, total_cost, cost_per_unit, brokerage.toFixed(4)
            ], (error2, result2) => {
              if (error2) {
                reject2(error2);
              }

              resolve(true)
            });
        });
      }else {
        if(row[5] > 0) {
          console.log("Row "+row[8]+" has already been processed previously. Ignoring.");
        }else {
          console.log("Row "+row[8]+" has not been filled. Ignoring.");
        }
      }
      resolve(true);
    });
  })
}

main();