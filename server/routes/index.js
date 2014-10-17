var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Route middlware to make sure a user is logged in.
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/restricted', isAuthenticated, function(req, res) {
  res.render('restricted', { user: req.user });
});

router.get('/login', function(req, res) {
  res.render('login', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/restricted',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/signup', function(req, res) {
  res.render('signup', { message: req.flash('signupMessage') });
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/restricted',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
