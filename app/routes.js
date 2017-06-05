var cookieParser = require('cookie-parser');
module.exports = function(app, passport) {
    app.use('/admin/', requiresAdmin);
    app.use(cookieParser());

    app.get('/', isLoggedIn, function(req, res) {
        res.render('results', { title: "Pomiary PK", isAdmin: isAdmin(req, res) });
    });

    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/signup', function(req, res) {
        res.render('register', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/admin/profile', function(req, res) {
        res.render('profile', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.get('/stations', isLoggedIn, function(req, res) {
        res.render('stations', { title: "Stanowiska", isAdmin: isAdmin(req, res) })
    })
    app.get('/login', function(req, res) {
        res.render('login', { title: "Zaloguj się" })
    })

    app.get('/admin/addStation', function(req, res) {
        console.log()
        res.render('addStation', { title: "Dodaj stację", isAdmin: isAdmin(req, res) })
    })


    app.get('/sensors', isLoggedIn, function(req, res) {
        res.render('sensors', { title: "Sensory", isAdmin: isAdmin(req, res) })
    })

    app.get('/admin/addSensor', function(req, res) {
        res.render('addSensor', { title: "Sensory", isAdmin: isAdmin(req, res) })
    })


    app.get('/admin/addFile', function(req, res) {
        res.render('addFile', { title: "Dodaj dane z pliku", isAdmin: isAdmin(req, res) })
    })


    app.get('/results', isLoggedIn, function(req, res) {
        res.render('results', { title: "Wyniki", isAdmin: isAdmin(req, res) })
    })

    app.get('/admin/addResults', isLoggedIn, function(req, res) {
        res.render('addResults', { title: "Dodaj wynik", isAdmin: isAdmin(req, res) })
    })
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
};

function requiresAdmin(req, res, next) {
    if (req.user && req.user.isAdmin === 1)
        return next();

    res.status(401).send("Unauthorized");
};

function isAdmin(req, res) {
    return req.user && req.user.isAdmin === 1;
}
