const express = require('express');
const router = express.Router();
const libPnl = require('../lib/pnl');

function sendError(res, status, data) {
  res.sendStatus(status).send(data);
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
    let pnlVals = await libPnl.getDailyPnls(req.params.start, req.params.end);
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

module.exports = router;