const config = require('config');
const pool = require('./mysql-connection-pool');

async function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection(async (conn_err, conn) => {
      if (conn_err) {
        reject(conn_err);
        return;
      }
      resolve(conn);
    });
  });
}

module.exports = {
  executeQueryCon : async function (conn, query, params) {
    return new Promise((resolve, reject) => {
      conn.query(query, params, (err, result) => {
        if (err) {
          conn.rollback(() => {
            reject(err);
          });
          return;
        }
        resolve(result);
      });
    });
  },

  executeQuery: async function (query, params) {
    
    return new Promise(async (resolve, reject) => {
      let conn = await getConnection();
      conn.query(query, params, (err, result) => {
        if (err) {
          conn.rollback(() => {
            conn.release();
            reject(err);
          });
          return;
        }
        conn.release();
        resolve(result);
        
      });
    });
  },

  getConnection: getConnection


}