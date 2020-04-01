const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({message:'API Version : 1.0. Status: Ready'});
});

module.exports = router;
