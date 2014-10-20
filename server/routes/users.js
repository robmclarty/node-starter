var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// GET list of users.
router.get('/', function(req, res) {
  User.find(function(err, users) {
    res.json(users);
  });
});

// POST create new user.
router.post('/', function(req, res) {
  var user = new User({
    email: req.body.userEmail,
    profile: {
      displayName: req.body.userName,
      description: req.body.userDescription
    }
  });

  user.save(function(err) {
    if (err) {
      res.send({ msg: err });
    } else {
      res.send({ msg: '' });
    }
  });
});

// GET individual user.
router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    res.json(user);
  });
});

// PUT update user.
router.put('/:id', function(req, res) {

});

// DELETE user.
router.delete('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    return user.remove(function(err) {
      if (err) {
        res.send({ msg: err });
      } else {
        return res.send({ msg: '' });
      }
    });
  });
});

module.exports = router;
