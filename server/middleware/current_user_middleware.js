// CMiddleware for adding `currentUser` to all requests when user is logged in.
function currentUser(req, res, next) {
  if (req.user) {
    var User = require('./models/user');
    User.findById(req.user, function(err, user) {
      res.locals.currentUser = user;
      next();
    });
  } else {
    next();
  }
};

module.exports = currentUser;
