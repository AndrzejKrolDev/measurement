var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'app',
  password : 'Developer123',
  database : 'mesurmentapi'
});

connection.connect();

connection.query('SELECT * from samples AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[2]);
});

connection.end();