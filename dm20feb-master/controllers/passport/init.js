var passport = require('passport');
var User = require('../../models/user');


module.exports = function() {

  //  user id is needed
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  //  user object is needed to enable req.user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

};