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
    let res = await db.executeQuery("SELECT code, quantity, cost_per_unit, total_cost, avg_cost, break_even FROM trade_cumulative");
    if(!res) {
      return [];
    }
    return res;
  },

  getBestDay : async () => {
    let res = await db.executeQuery("SELECT dp.* FROM `daily_pnl` dp JOIN (SELECT MAX(profit_loss) mp FROM daily_pnl) sub ON sub.mp=dp.profit_loss ORDER BY dp.date DESC LIMIT 1",[]);
    if(!res || res.length == 0) {
      return {};
    }
    return res[0];
  },

  getWorstDay : async () => {
    let res = await db.executeQuery("SELECT dp.* FROM `daily_pnl` dp JOIN (SELECT MIN(profit_loss) mp FROM daily_pnl) sub ON sub.mp=dp.profit_loss ORDER BY dp.date DESC LIMIT 1",[]);
    if(!res || res.length == 0) {
      return {};
    }
    return res[0];
  },

  getWinLooseCounts: async () => {
    let res = await db.executeQuery("SELECT COUNT(IF( pnl>0, 1, NULL)) winners, COUNT(IF( pnl<0, 1,NULL)) losers, COUNT(IF (break_even_flag=1,1,NULL)) break_evens, COUNT(IF(pnl>0 OR pnl<0 OR break_even_flag=1,1,NULL)) AS all_trades FROM `trade_records`",[]);
    if(!res || res.length == 0) {
      return {};
    }
    return res[0];
  },
}