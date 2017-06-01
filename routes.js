module.exports = function(app){

    //routes
app.get('/log', function(req, res) {
    passport.
    res.render('index', { title: "Pomiary PK" })
})

app.get('/', function(req, res) {
    res.render('index', { title: "Pomiary PK" })
})


app.get('/stations', function(req, res) {
    res.render('stations', { title: "Stacje" })
})
app.get('/login', function(req, res) {
    res.render('login', { title: "Zaloguj się" })
})

app.get('/addStation', function(req, res) {
    res.render('addStation', { title: "Dodaj stację" })
})


app.get('/sensors', function(req, res) {
    res.render('sensors', { title: "Sensory" })
})

app.get('/addSensor', function(req, res) {
    res.render('addSensor', { title: "Sensory" })
})


app.get('/dodajPlik', function(req, res) {
    res.render('addFile', { title: "Dodaj dane z pliku" })
})


app.get('/results', function(req, res) {
    res.render('results', { title: "Stacje" })
})
}