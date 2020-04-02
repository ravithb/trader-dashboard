const config = require('config');
const moment = require('moment');
const db = require('../lib/db-utils');

module.exports = {
  getOverallPnl: async () => {
    let res = await db.executeQuery("SELECT SUM(pnl) as pnl FROM trade_records WHERE pnl!=0",[]);
    if(!res) {
      return 0;
    }
    return res[0]['pnl'];
  },

  getPnlForPeriod: async (start,end) => {
    let res = await db.executeQuery("SELECT SUM(pnl) as pnl FROM trade_records WHERE pnl!=0  AND DATE(`date`) BETWEEN ? and ?",[start,end]);
    if(!res) {
      return 0;
    }
    return res[0]['pnl'];
  },

  getPnlByDate: async (dateStr) => {
    let dateStdStr = moment(dateStr,"YYYYMMDD").format("YYYY-MM-DD");
    let res = await db.executeQuery("SELECT SUM(pnl) as pnl FROM trade_records WHERE pnl!=0 And DATE(`date`)=?",[dateStdStr]);
    if(!res) {
      return 0;
    }
    return res[0]['pnl'];
  },

  getDailyPnls: async (start, end) => {
    let res = await db.executeQuery("SELECT Date(`date`) as date, SUM(pnl) as pnl FROM trade_records WHERE pnl!=0 AND DATE(`date`) BETWEEN ? and ? GROUP BY DATE(`date`)",[start,end]);
    if(!res) {
      return [];
    }
    return res;
  },

  getPnlsByCode : async () => {
    let res = await db.executeQuery("SELECT code, SUM(pnl) as pnl FROM trade_records WHERE pnl!=0 GROUP BY code",[]);
    if(!res) {
      return [];
    }
    return res;
  },

  getDailyPnlsByCode : async (start, end) => {
    let startStdStr = moment(start,"YYYYMMDD").format("YYYY-MM-DD");
    let endStdStr = moment(end,"YYYYMMDD").format("YYYY-MM-DD");
    let res = await db.executeQuery("SELECT  DATE(`date`) as date, code, SUM(pnl) as pnl FROM trade_records WHERE pnl!=0 And DATE(`date`) BETWEEN ? and ?  GROUP BY  DATE(`date`), code",[startStdStr,endStdStr]);
    if(!res) {
      return [];
    }
    return res;
  },

  getPortolio: async () => {
    let res = await db.executeQuery("SELECT code, quantity, cost_per_unit, total_cost, avg_price, break_even FROM trade_cumulative");
    if(!res) {
      return [];
    }
    return res;
  }
}