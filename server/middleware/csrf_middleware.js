var express = require('express');
var router = express.Router();
var passport = require('passport');

// Set AngularJS's CSRF token header.
exports.angularCSRF = function(req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
};

// Include AngularJS's X-XSRF-TOKEN header when looking for CSRF token.
exports.csrfValue = function(req) {
  var token = (req.body && req.body._csrf) ||
              (req.query && req.query._csrf) ||
              (req.headers['x-csrf-token']) ||
              (req.headers['x-xsrf-token']);
  return token;
};
