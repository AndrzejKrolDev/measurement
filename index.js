var express = require('express');
var app = express();
var fs = require("fs");
var qs = require('querystring');
app.use('/views', express.static('views/assets'))
app.set('view engine', 'pug')
var cookieParser = require('cookie-parser');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'app',
    password: 'Developer123',
    database: 'measurement',
    debug: false
});





var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})


require('./routes')(app);
require('./routesAPI')(app, pool);
app.use(function(err, req, res, next) {
    if (401 == err.status) {
        console.log(req.url);
        res.redirect('/login?redirectUrl='+req.url.substring(1));
    }
});
