const express = require('express');
const logger = require('morgan');
const path = require('path');
const config = require('config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const api = require('./routes/baseApi');

// const auth = require('./auth/auth')();

const app = express();
app.disable('etag');
app.disable('x-powered-by');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
  res.header("X-Frame-Options","SAMEORIGIN");
  res.header("X-XSS-Protection","1; mode=block");
  res.header("Strict-Transport-Security","max-age=31536000;");
  res.header("Cache-Control","no-cache");
  res.header("Pragma","no-cache");

  next();
});

app.use(logger('dev'));
app.use(bodyParser.json({
  limit: '40mb'
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(auth.initialize());
app.use(express.static(path.join(__dirname, 'public')));

var apiUrlPrefix = "/v1"
if(!process.env.NODE_ENV){
  process.env.NODE_ENV='default';
}


app.use('/', index);
app.use(apiUrlPrefix+'/', index);
app.use(apiUrlPrefix+'/', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found '+req.originalUrl);
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;