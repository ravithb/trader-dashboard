const config = require('config');
const pool = require('./mysql-connection-pool');
const moment = require('moment');
const dbUtil = require('./db-utils');

const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const executeQuery = dbUtil.executeQueryCon;

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

function hasFlag(flag) {
  return args.includes(flag);
}

async function doImportFile(path) {
  let inputStream = fs.createReadStream(path, 'utf8');
  let promises = [];
  return new Promise((resolve, reject) => {
    inputStream
      .pipe(new CsvReadableStream({
        parseNumbers: true,
        parseBooleans: true,
        trim: true,
        skipHeader: true
      }))
      .on('data', async function (row) {
        if (row.length > 8) {
          reject("Unexpected row length " + row.length);
        }
        // console.log(row);
        try {
          let result = processRow(row);
          promises.push(result);

        } catch (e) {
          console.log(e);
          reject(e);
        }
      })
      .on('end', async function (data) {
        console.log('No more rows!');
        await Promise.all(promises);
        await populateCumulative();
        resolve(true);
      });
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
        let trade_recs = await executeQuery(conn, "SELECT * FROM trade_records WHERE processed_for_tc=0 ORDER BY date, confirmation_no", []);

        for (let i in trade_recs) {
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

                let trade_cum = await executeQuery(conn, "SELECT * FROM trade_cumulative WHERE code=?", [trade_recs[i]['code']]);

                // If the record does not exist in cumulative, add it.
                if (trade_cum.length == 0) {
                  let multiplier = (trade_recs[i]['action'] == 'Sell' ? -1.0 : 1.0);
                  let qty = trade_recs[i]['quantity'] * multiplier;
                  let break_even = (trade_recs[i]['fees'] / trade_recs[i]['quantity']) + (multiplier * trade_recs[i]['cost_per_unit']);
                  await executeQuery(conn, "INSERT INTO trade_cumulative (code, quantity, cost_per_unit, total_cost, avg_cost, break_even) VALUES (?,?,?,?,?,?)",
                    [trade_recs[i]['code'], qty, trade_recs[i]['cost_per_unit'], trade_recs[i]['total_cost'], trade_recs[i]['total_cost']/trade_recs[i]['quantity'], break_even]);

                  await executeQuery(conn, "UPDATE trade_records_imported SET processed_for_tc=?, pnl=?, break_even_flag=? WHERE id=?",
                    [1, 0, 0, trade_recs[i]['id']]);

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
                  let new_quantity = ((trade_recs[i]['action'] == 'Sell' ? -1 : 1) * trade_recs[i]['quantity']) + trade_cum[0]['quantity'];
                  let pnl = 0;
                  let break_even_flag = 0;

                  if (trade_cum[0]['quantity'] > 0 && trade_recs[i]['action'] == 'Sell') {
                    pnl = (trade_recs[i]['quantity'] * trade_recs[i]['cost_per_unit']) - (trade_recs[i]['quantity'] * trade_cum[0]['avg_cost']);
                    if(pnl>-0.001 && pnl < 0.001){
                      break_even_flag = 1;
                    }
                  } else if (trade_cum[0]['quantity'] < 0 && trade_recs[i]['action'] == 'Buy') {
                    pnl =  (trade_recs[i]['quantity'] * trade_cum[0]['avg_cost']) - (trade_recs[i]['quantity'] * trade_recs[i]['cost_per_unit']);
                    if(pnl>-0.001 && pnl < 0.001){
                      break_even_flag = 1;
                    }
                  }

                  if (new_quantity == 0) {
                    await executeQuery(conn, "DELETE FROM trade_cumulative WHERE id=?", [trade_cum[0]['id']]);
                  } else {
                    let new_total_cost = trade_recs[i]['total_cost'] + trade_cum[0]['total_cost'];
                    let new_cost_per_unit = (new_quantity > 0) ? (new_total_cost / new_quantity) : 0;
                    let avg_cost = (trade_cum[0]['quantity'] * trade_cum[0]['avg_cost'] + trade_recs[i]['gross_total']) / (trade_cum[0]['quantity'] + trade_recs[i]['quantity']);
                    let break_even = (trade_recs[i]['fees'] / (new_quantity)) + ((trade_recs[i]['action'] == 'Sell' ? -1 : 1) * new_cost_per_unit);
                    await executeQuery(conn, "UPDATE trade_cumulative SET cost_per_unit=?,quantity=?,total_cost=?,avg_cost=?,break_even=? WHERE id=?",
                      [new_cost_per_unit, new_quantity, new_total_cost, avg_cost, break_even, trade_cum[0]['id']]);
                  }

                  await executeQuery(conn, "UPDATE trade_records_imported SET processed_for_tc=?, pnl=?,break_even_flag=? WHERE id=?",
                    [1, pnl,break_even_flag, trade_recs[i]['id']]);

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
                reject_inner(e);
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
    pool.query("SELECT COUNT(*) as c FROM trade_records WHERE confirmation_no=?", [row[1]], async (error, result) => {

      if (error) {
        reject(error);
        return;
      }

      if (result.length == 1 && result[0]['c'] == 0 && row[3] > 0) {
        console.log("Processing row with confirmation no ", row[1]);
        let brokerage = row[6];
        let gross_total = (row[5] * 1 * row[3]);
        let total_cost = ((row[4] == 'Sell') ? (gross_total - brokerage) : (gross_total + brokerage)).toFixed(6);
        let cost_per_unit = (total_cost * 1.0 / (row[3] * 1.0)).toFixed(6);
        gross_total = gross_total.toFixed(6);

        await new Promise((resolve2, reject2) => {
          pool.query("INSERT INTO trade_records_imported (`date`,`confirmation_no`,`code`,`quantity`,`action`,`price`,`gross_total`,`total_cost`,`cost_per_unit`,`fees`) "+
            "VALUES (?,?,?,?,?,?,?,?,?,?)",
            [
              moment(row[0], "DD/MM/YYYY").toDate(), row[1], row[2], row[3], row[4], row[5], gross_total, total_cost, cost_per_unit, brokerage.toFixed(6)
            ], (error2, result2) => {
              if (error2) {
                reject2(error2);
              }

              resolve(true)
            });
        });
      } else {
        console.log("Row " + row[8] + " has already been processed previously. Ignoring.");
      }
      resolve(true);
    });
  })
}

module.exports = {
  hasFlag: hasFlag,
  doImportFile: doImportFile,
  truncateTables: truncateTables
}