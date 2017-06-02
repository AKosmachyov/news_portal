const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

const profile = require('./routes/profile');
const news = require('./routes/news');

const dataBase = require('./module/database');

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: './dist' });
});

app.use('/api/profile', profile);
app.use('/api/news', news);

app.get('*', function (req, res) {
    res.sendFile('index.html', { root: './dist' });
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
        dataBase.reconnectToDB();
    }
  res.status(err.status || 500).send(err.message);
});

module.exports = app;
