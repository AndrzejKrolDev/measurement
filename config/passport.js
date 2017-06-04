var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var passport = require('passport');
var bcrypt   = require('bcrypt-nodejs');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'measurement_db'
});

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query("select * from users where id = '" + id + "'", function(err,rows){
      done(err, rows[0]);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function(req, email, password, done) {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    connection.query("select * from users where email = '" + email + "'",function(err,rows){
      if (err) {
        return done(err);
      }
      if (rows.length) {
        return done(null, false, req.flash('signupMessage', 'Ten email jest już zajęty.'));
      } else {

        // if there is no user with that email
        // create the user
        var newUserMysql = new Object();

        newUserMysql.email    = email;
        newUserMysql.password = generateHash(password); // use the generateHash function in our user model
        connection.query('INSERT INTO users SET ?', { email: email, password: newUserMysql.password },
        function(err, rows) {
          newUserMysql.id = rows.insertId;

          return done(null, newUserMysql);
        });
      }
    });
  }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, function(req, email, password, done) { // callback with email and password from our form
    connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'",function(err,rows){
      if (err)
        return done(err);
      if (!rows.length) {
        return done(null, false, req.flash('loginMessage', 'Nie znaleziono użytkownika.')); // req.flash is the way to set flashdata using connect-flash
      }

      // if the user is found but the password is wrong
      if (!validPassword(password, rows[0].password))
        return done(null, false, req.flash('loginMessage', 'Ups! Niepoprawne hasło.')); // create the loginMessage and save it to session as flashdata
      // all is well, return successful user
      return done(null, rows[0]);
    });
  }));

  var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };

  // checking if password is valid
  var validPassword = function(passwordToCheck, password) {
    return bcrypt.compareSync(passwordToCheck, password);
  };

};
