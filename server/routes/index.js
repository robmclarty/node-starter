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

// GET home page.
router.get('/', function(req, res) {
  res.render('index', { 
    title: 'The App',
    csrfToken: req.csrfToken()
  });
});

// GET restricted page.
router.get('/restricted', isAuthenticated, function(req, res) {
  res.render('restricted', { user: req.user });
});

// GET login page.
router.get('/login', function(req, res) {
  res.render('login', { 
    message: req.flash('loginMessage'), 
    csrfToken: req.csrfToken() 
  });
});

// POST login.
router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/restricted',
  failureRedirect: '/login',
  failureFlash: true
}));

// GET signup page.
router.get('/signup', function(req, res) {
  res.render('signup', {
    message: req.flash('signupMessage'), 
    csrfToken: req.csrfToken 
  });
});

// POST signup.
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/restricted',
  failureRedirect: '/signup',
  failureFlash: true
}));

// GET logout.
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
