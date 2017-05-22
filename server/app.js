const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const profile = require('./routes/profile');

const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.use('/app', express.static(path.join(__dirname, '../app')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: './app' });
});
app.use('/profile', profile);

app.get('*', function (req, res, next) {
    res.sendFile('index.html', { root: './app' });
});
//catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
  res.send(err);
});

module.exports = app;