var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var csrf = require('csurf');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dbConfig = require('../config/database.js');
var passport = require('passport');

mongoose.connect(dbConfig.url); // connect to database using info in dbConfig file
require('./passport.js')(passport); // pass passport for configuration

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({ 
  secret: '42',
  resave: true,
  saveUninitialized: true,
  key: 'passwordless_session'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, '../public')));

// Custom middleware for adding `currentUser` to all requests when user is logged in.
app.use(function(req, res, next) {
  if (req.user) {
    var User = require('./models/user');
    User.findById(req.user, function(err, user) {
      res.locals.currentUser = user;
      next();
    });
  } else {
    next();
  }
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
