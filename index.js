var express = require('express');
var app = express();
var fs = require("fs");
var qs = require('querystring');
app.use('/views', express.static('views/assets'))
app.set('view engine', 'pug')
var cookieParser = require('cookie-parser');
var mysql = require('mysql');


var fs = require("fs");
var qs = require('querystring');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var bodyParser = require('body-parser');

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'app',
    password: 'Developer123',
    database: 'measurement',
    debug: false
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/views', express.static('views/assets'));
app.use('/admin/views', express.static('views/assets'));

app.set('view engine', 'pug');

app.use(session({ secret: 'measurement', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport,pool);
require('./app/routesAPI')(app, pool);
require('./config/passport')(passport,pool.get); 

var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})


