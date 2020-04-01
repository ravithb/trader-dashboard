const mysql = require('mysql');
const config = require('config');
const pool  = mysql.createPool({
  connectionLimit : 10,
  host            : config.mysqlHost,
  port            : config.mysqlPort,
  user            : config.mysqlUser,
  password        : config.mysqlPass,
  database        : config.mysqlDb
});

module.exports = pool