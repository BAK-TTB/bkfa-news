const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var messages = require('express-messages')
const fileUpload = require('express-fileupload')
const validator = require('express-validator');

var multer = require('multer');
// var csrf = require('csurf');
var fs = require('fs');
var crypto = require('crypto');

var func = require('./config/functions');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ma-bi-mat-tu-dat',
  saveUninitialized: true,
  resave: true
}));
// app.use(csrf());
// app.configure(function() {
//   app.use(express.cookieParser('TTB'));
//   app.use(express.session({ cookie: { maxAge: 60000 }}));
//   app.use(flash());
// });

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res);
  next();
});


const mountRoutes = require('./routes');
mountRoutes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
