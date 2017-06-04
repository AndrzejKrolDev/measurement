module.exports = function(app, passport) {
  app.use('/admin/', requiresAdmin);

  app.get('/', isLoggedIn, function(req, res) {
    res.render('index', { title: "Pomiary PK"});
  });

  app.get('/listUsers', isLoggedIn, function(req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
      res.status(200).end(data);
    });
  });

  app.get('/login', function(req, res) {
    res.render('login', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/admin/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/signup', function(req, res) {
    res.render('register', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/admin/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/admin/profile', function(req, res) {
    res.render('profile', {
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });
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
  if(req.user && req.user.isAdmin===1)
    return next();

  res.status(401).send("Unauthorized");
};
