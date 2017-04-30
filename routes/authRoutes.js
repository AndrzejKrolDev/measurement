var express = require('express');
var authRouter = express.Router();
var mysql = require('mysql');

authRouter.post('/signUp', function(req,res) {
  console.log(req.body);
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'measurement_db'
  });
  connection.query('INSERT INTO users SET ?', { email: req.body.email, password: req.body.password },
    function(error, results, fields) {
      if (error) throw error;
      req.login(results, function() {
        res.redirect('/auth/profile');
      });
    });

});

authRouter.get('/profile', function(req, res) {
  res.json(req.user);
});

module.exports = authRouter;
