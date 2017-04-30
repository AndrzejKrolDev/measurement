var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
  passport.use(new LocalStrategy({
    emailField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    var user = {
      email: email,
      password: password
    };
    done(null, user);
  }));
};
