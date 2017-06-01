var express = require('express');
var app = express();
var fs = require("fs");
var qs = require('querystring');
app.use('/views', express.static('views/assets'))
app.set('view engine', 'pug')

var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'app',
//     password: 'Developer123',
//     database: 'mesurmentapi'
// });

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'app',
    password: 'Developer123',
    database: 'mesurmentapi',
    debug: false
});

require('./routes')(app);
require('./routesAPI')(app,pool);


//passport
const passport = require('passport');
const Strategy = require('passport-local');

passport.use(new Strategy(
    function(username, password, done) {
        // database dummy - find user and verify password
        if (username === 'devils name' && password === '666') {
            done(null, {
                id: 666,
                firstname: 'devils',
                lastname: 'name',
                email: 'devil@he.ll',
                verified: true
            });
        } else {
            done(null, false);
        }
    }
));

app.use(passport.initialize());


function serialize(req, res, next) {
    db.updateOrCreate(req.user, function(err, user) {
        if (err) {
            return next(err);
        }
        // we store the updated information in req.user again
        req.user = {
            id: user.id
        };
        next();
    });
}

const db = {
    updateOrCreate: function(user, cb) {
        // db dummy, we just cb the user
        cb(null, user);
    }
};


const jwt = require('jsonwebtoken');

function generateToken(req, res, next) {
    req.token = jwt.sign({
        id: req.user.id,
    }, 'server secret', {});
    next();
}


function respond(req, res) {
    res.status(200).json({
        user: req.user,
        token: req.token
    });
}

app.use(passport.initialize());
app.post('/auth', passport.authenticate(
    'local', {
        session: false
    }), serialize, generateToken, respond);

const expressJwt = require('express-jwt');
const authenticate = expressJwt({ secret: 'server secret' });

app.get('/me', authenticate, function(req, res) {
    res.status(200).json(req.user);
});




var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})
