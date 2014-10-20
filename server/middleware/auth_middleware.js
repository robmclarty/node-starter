// Route middlware to make sure a user is logged in.
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Route middleware to determine if currentUser is allowed to make modifications on this endpoint.
exports.canModify = function(req, res,  next) {

};
