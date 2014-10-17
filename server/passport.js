var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // Local Signup
  // ============

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  }, 
  function(req, email, password, done) {
    // asynchronous
    // User.findOne won't fire unless data is sent back
    process.nextTick(function() {
      User.findOne({ 'email': email }, function(err, user) {
        if (err) { return done(err); }
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser = new User();
          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.save(function(err) {
            if (err) { throw err; }
            return done(null, newUser);
          });
        }
      });
    });
  }));


  // Local Login
  // ===========

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, 
  function(req, email, password, done) {
    User.findOne({ 'email': email }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Oop! Wrong password.'));
      }
      return done(null, user);
    });
  }));

};
