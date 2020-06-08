const express = require('express');
const router = express.Router();
const libPnl = require('../lib/pnl');
const moment = require('moment');

const multer = require('multer');
const upload = multer({dest:'/tmp'});

const impUtils = require('../lib/import-utils');

const STD_DATE_FORMAT = "YYYY-MM-DD";
const INPUT_DATE_FORMAT = "YYYYMMDD";

function sendError(res, status, data) {
  res.status(status).send(data);
}

/* GET home page. */
router.get('/getOverallPnl', async (req, res, next) => {
  try {
    let pnlVal = await libPnl.getOverallPnl();
    res.send({
      "data": pnlVal
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getPnlByDate/:date', async (req, res) => {
  try {
    let pnlVal = await libPnl.getPnlByDate(req.params.date);
    res.send({
      "data": pnlVal
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getDailyPnls/:start/:end', async (req, res) => {
  try {
    let startStdStr = moment(req.params.start,INPUT_DATE_FORMAT).format(STD_DATE_FORMAT);
    let endStdStr = moment(req.params.end,INPUT_DATE_FORMAT).format(STD_DATE_FORMAT);
    let pnlVals = await libPnl.getDailyPnls(startStdStr, endStdStr);
    res.send({
      "data": pnlVals
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getPnlsByCode', async (req, res) => {
  try {
    let pnlVals = await libPnl.getPnlsByCode(req.params.start, req.params.end);
    res.send({
      "data": pnlVals
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getDailyPnlsByCode/:start/:end', async (req, res) => {
  try {
    let pnlVals = await libPnl.getDailyPnlsByCode(req.params.start, req.params.end);
    res.send({
      "data": pnlVals
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getPnlThisWeek', async (req, res) => {
  const from_date = moment().startOf('week').format(STD_DATE_FORMAT);
  const to_date = moment().endOf('week').format(STD_DATE_FORMAT);
  try {
    let pnlVals = await libPnl.getPnlForPeriod(from_date, to_date);
    res.send({
      "data": pnlVals
    });
  } catch (e) {
    console.log(e);
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getPortfolio', async (req, res) => {
  try {
    let pnlVals = await libPnl.getPortolio();
    res.send({
      "data": pnlVals
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getBestDay', async (req, res) => {
  try {
    let pnlVals = await libPnl.getBestDay();
    res.send({
      "data": pnlVals
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getWorstDay', async (req, res) => {
  try {
    let pnlVals = await libPnl.getWorstDay();
    res.send({
      "data": pnlVals
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.get('/getWinLooseCounts', async (req, res) => {
  try {
    let pnlVals = await libPnl.getWinLooseCounts();
    res.send({
      "data": pnlVals
    });
  } catch (e) {
    sendError(res, 400, {
      "error": e
    })
  }
});

router.post('/uploadTradingFile', upload.single('tfile'), async (req,res)=>{

  if(!req.file) {
    sendError(res, 400,{
      "error": "No file upload detected under key 'tfile'"
    });
    return;
  }

  try{
    let impResult = await impUtils.doImportFile(req.file.path);

    res.send({
      "data": "OK"
    })
  } catch(e) {
    console.log(e);
    sendError(res,400,e);
  }
})

module.exports = router;