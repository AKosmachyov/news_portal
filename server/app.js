const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

const profile = require('./routes/profile');
const news = require('./routes/news');

const dataBase = require('./database');

const app = express();

app.use('/app', express.static(path.join(__dirname, '../app')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: './app' });
});

app.use('/api/profile', profile);
app.use('/api/news', news);

app.get('*', function (req, res) {
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
    if (err.name == "MongoError") {
        err.message = "Problem with database";
        err.status = 500;
    }
  res.send(err.message, err.status || 500);
});

module.exports = app;
