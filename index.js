var express = require('express');
var app = express();
var fs = require("fs");
var qs = require('querystring');
app.use('/views', express.static('views/assets'))
app.set('view engine', 'pug')

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'app',
    password: 'Developer123',
    database: 'mesurmentapi'
});


app.get('/db', function(req, res) {

    connection.query('SELECT * from samples AS solution', function(error, results, fields) {
        if (error) throw error;
        var objToJson = results;
        var response = [];
        for (var key in results) {
            console.log(results[key]);
            response.push(results[key]);
        }
        objToJson.response = response;
        var finalresponse = JSON.stringify(objToJson);
        res.render('index', { title: "", message: "{\"samples\":" + finalresponse + "}" })
    });

})

app.get('/', function(req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
        res.render('index', { title: "", message: data })
    });
})

app.get('/listUsers', function(req, res) {
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function(err, data) {
        console.log(data);
        res.status(200).end(data);
    });
})


app.get('/sample', function(req, res) {
    var query = require('url').parse(req.url, true).query;

    var startDate = query.startDate;
    var endDate = query.endDate;
    var station = query.station;
    var sensor = query.sensor;
    var firstIndex = query.firstIndex;
    var lastIndex = query.lastIndex;
    if (!firstIndex) { firstIndex = 0; }
    if (!lastIndex) { lastIndex = 100; }

    if (!startDate && !endDate && !station && !sensor) {
        connection.query('SELECT sampleDate,sampleValue ,sensorsNumber,stationsNumber ' +
            'FROM mesurmentapi.samples ' +
            'INNER JOIN mesurmentapi.sensors ' +
            'ON mesurmentapi.sensors.idsensors =sampleSensorId ' +
            'INNER JOIN mesurmentapi.stations ' +
            'on sensorStationId =idstations ',
            function(error, results, fields) {
                if (error) throw error;
                var objToJson = results;
                var response = [];
                for (var key in results) {
                    response.push(results[key]);
                }
                objToJson.response = response;
                var finalresponse = JSON.stringify(objToJson);
                res.status(200).end("{\"samples\":" + finalresponse + "}")
            });
    }
    if (startDate && endDate && station && sensor) {
        connection.query('SELECT sampleDate,sampleValue ,sensorsNumber,stationsNumber ' +
            'FROM mesurmentapi.samples ' +
            'INNER JOIN mesurmentapi.sensors ' +
            'ON mesurmentapi.sensors.idsensors =sampleSensorId ' +
            'INNER JOIN mesurmentapi.stations ' +
            'on sensorStationId =idstations ' +
            'where stationsNumber = ?  and sensorsNumber = ? and sampleDate < ? and sampleDate > ? Limit ' + firstIndex + ',' + lastIndex, [station, sensor, endDate, startDate],
            function(error, results, fields) {
                if (error) throw error;
                var objToJson = results;
                var response = [];
                for (var key in results) {
                    response.push(results[key]);
                }
                objToJson.response = response;
                var finalresponse = JSON.stringify(objToJson);
                res.status(200).end("{\"samples\":" + finalresponse + "}")
            });
    }
    if (startDate && endDate && station) {
        connection.query('SELECT sampleDate,sampleValue ,sensorsNumber,stationsNumber ' +
            'FROM mesurmentapi.samples ' +
            'INNER JOIN mesurmentapi.sensors ' +
            'ON mesurmentapi.sensors.idsensors =sampleSensorId ' +
            'INNER JOIN mesurmentapi.stations ' +
            'on sensorStationId =idstations ' +
            'where stationsNumber = ?  and  sampleDate < ? and sampleDate > ? Limit ' + firstIndex + ',' + lastIndex, [station, endDate, startDate],
            function(error, results, fields) {
                if (error) throw error;
                var objToJson = results;
                var response = [];
                for (var key in results) {
                    response.push(results[key]);
                }
                objToJson.response = response;
                var finalresponse = JSON.stringify(objToJson);
                res.status(200).end("{\"samples\":" + finalresponse + "}")
            });
    }
    if (startDate && endDate) {
        connection.query('SELECT sampleDate,sampleValue ,sensorsNumber,stationsNumber ' +
            'FROM mesurmentapi.samples ' +
            'INNER JOIN mesurmentapi.sensors ' +
            'ON mesurmentapi.sensors.idsensors =sampleSensorId ' +
            'INNER JOIN mesurmentapi.stations ' +
            'on sensorStationId =idstations ' +
            'where  sampleDate < ? and sampleDate > ? Limit ' + firstIndex + ',' + lastIndex, [endDate, startDate],
            function(error, results, fields) {
                if (error) throw error;
                var objToJson = results;
                var response = [];
                for (var key in results) {
                    response.push(results[key]);
                }
                objToJson.response = response;
                var finalresponse = JSON.stringify(objToJson);
                res.status(200).end("{\"samples\":" + finalresponse + "}")
            });
    }
    if (station && sensor) {
        console.log("alspdlsapdla");
        connection.query('SELECT sampleDate,sampleValue ,sensorsNumber,stationsNumber ' +
            'FROM mesurmentapi.samples ' +
            'INNER JOIN mesurmentapi.sensors ' +
            'ON mesurmentapi.sensors.idsensors =sampleSensorId ' +
            'INNER JOIN mesurmentapi.stations ' +
            'on sensorStationId =idstations ' +
            'where stationsNumber = ? and  sensorsNumber = ?   Limit ' + firstIndex + ',' + lastIndex, [station, sensor],
            function(error, results, fields) {
                if (error) throw error;
                var objToJson = results;
                var response = [];
                for (var key in results) {
                    response.push(results[key]);
                }
                objToJson.response = response;
                var finalresponse = JSON.stringify(objToJson);
                res.status(200).end("{\"samples\":" + finalresponse + "}")
            });
    }
    if (station) {
        connection.query('SELECT sampleDate,sampleValue ,sensorsNumber,stationsNumber ' +
            'FROM mesurmentapi.samples ' +
            'INNER JOIN mesurmentapi.sensors ' +
            'ON mesurmentapi.sensors.idsensors =sampleSensorId ' +
            'INNER JOIN mesurmentapi.stations ' +
            'on sensorStationId =idstations ' +
            'where stationsNumber = ?  Limit ' + firstIndex + ',' + lastIndex, [station],
            function(error, results, fields) {
                if (error) throw error;
                var objToJson = results;
                var response = [];
                for (var key in results) {
                    response.push(results[key]);
                }
                objToJson.response = response;
                var finalresponse = JSON.stringify(objToJson);
                res.status(200).end("{\"samples\":" + finalresponse + "}")
            });
    }
})




app.post('/station', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {
        var data = qs.parse(body);
        connection.query('INSERT INTO mesurmentapi.stations SET ?', { stationsNumber: data.number, stationsName: data.name, stationsDesc: data.description }, function(error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
        res.status(200).end("");
    });
})

app.get(['/station/:id', '/station'], function(req, res) {
    var id = req.params.id;
    if (id) {
        connection.query('SELECT stationsName,stationsNumber,stationsDesc from mesurmentapi.stations AS solution where stationsNumber =?', [id], function(error, results, fields) {
            if (error) throw error;
            var objToJson = results;
            var response = [];
            for (var key in results) {
                console.log(results[key]);
                response.push(results[key]);
            }
            objToJson.response = response;
            var finalresponse = JSON.stringify(objToJson);
            res.header("Content-Type", "application/json; charset=utf-8");
            res.status(200).end("{\"stations\":" + finalresponse + "}")
        });
    } else {
        connection.query('SELECT stationsName,stationsNumber,stationsDesc from  mesurmentapi.stations AS solution', function(error, results, fields) {
            if (error) throw error;
            var objToJson = results;
            var response = [];
            for (var key in results) {
                console.log(results[key]);
                response.push(results[key]);
            }
            objToJson.response = response;
            var finalresponse = JSON.stringify(objToJson);
            res.header("Content-Type", "application/json; charset=utf-8");
            res.status(200).end("{\"stations\":" + finalresponse + "}")
        });
    }


})


app.post('/sensor', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    var stationId;
    req.on('end', function() {
        var data = qs.parse(body);
        connection.query('SELECT idstations from mesurmentapi.stations AS solution where stationsNumber =?', [data.stationNumber], function(error, results, fields) {
            if (error) throw error;
            stationId = (results[0].idstations);
            connection.query('INSERT INTO mesurmentapi.sensors SET ?', { sensorsNumber: data.number, sensorsName: data.name, sensorsDesc: data.description, sensorStationId: stationId }, function(error, results, fields) {
                if (error) throw error;
                console.log(results.insertId);
            });
            res.status(200).end("");
        });


    });
})

app.get(['/sensor/:id', '/sensor'], function(req, res) {
    var id = req.params.id;
    var query = require('url').parse(req.url, true).query;
    var stationNumber = query.station;
    if (!stationNumber && !id) {
        connection.query('SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber FROM mesurmentapi.sensors INNER JOIN mesurmentapi.stations ON mesurmentapi.sensors.sensorStationId =mesurmentapi.stations.idstations', function(error, results, fields) {
            if (error) throw error;
            console.log(fields);
            var objToJson = results;
            var response = [];
            for (var key in results) {
                console.log(results[key]);
                response.push(results[key]);
            }
            objToJson.response = response;
            var finalresponse = JSON.stringify(objToJson);
            res.header("Content-Type", "application/json; charset=utf-8");
            res.status(200).end("{\"sensors\":" + finalresponse + "}")
        });
    }
    if (id && !stationNumber) {
        connection.query('SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber FROM mesurmentapi.sensors INNER JOIN mesurmentapi.stations ON mesurmentapi.sensors.sensorStationId =mesurmentapi.stations.idstations where mesurmentapi.sensors.sensorsNumber = ?', [id], function(error, results, fields) {
            if (error) throw error;
            console.log(fields);
            var objToJson = results;
            var response = [];
            for (var key in results) {
                console.log(results[key]);
                response.push(results[key]);
            }
            objToJson.response = response;
            var finalresponse = JSON.stringify(objToJson);
            res.header("Content-Type", "application/json; charset=utf-8");
            res.status(200).end("{\"sensors\":" + finalresponse + "}")
        });

    }

    if (stationNumber) {
        connection.query('SELECT idstations from mesurmentapi.stations AS solution where stationsNumber = ? ', [stationNumber], function(error, results, fields) {
            stationId = results[0].idstations;
            if (id) {
                connection.query('SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber FROM mesurmentapi.sensors INNER JOIN mesurmentapi.stations ON mesurmentapi.sensors.sensorStationId =mesurmentapi.stations.idstations where mesurmentapi.sensors.sensorsNumber = ? and mesurmentapi.stations.idstations=?', [id, stationId], function(error, results, fields) {
                    if (error) throw error;
                    console.log(fields);
                    var objToJson = results;
                    var response = [];
                    for (var key in results) {
                        console.log(results[key]);
                        response.push(results[key]);
                    }
                    objToJson.response = response;
                    var finalresponse = JSON.stringify(objToJson);
                    res.header("Content-Type", "application/json; charset=utf-8");
                    res.status(200).end("{\"sensors\":" + finalresponse + "}")
                });
            } else {
                connection.query('SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber FROM mesurmentapi.sensors INNER JOIN mesurmentapi.stations ON mesurmentapi.sensors.sensorStationId =mesurmentapi.stations.idstations where  mesurmentapi.stations.idstations=?', [stationId], function(error, results, fields) {
                    console.log("XD");
                    if (error) throw error;
                    var objToJson = results;
                    var response = [];
                    for (var key in results) {
                        console.log(results[key]);
                        response.push(results[key]);
                    }
                    objToJson.response = response;
                    var finalresponse = JSON.stringify(objToJson);
                    res.header("Content-Type", "application/json; charset=utf-8");
                    res.status(200).end("{\"sensors\":" + finalresponse + "}")
                })
            }
        })
    } else {


    }
})

app.post('/sample', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {
        var data = qs.parse(body);
        connection.query('INSERT INTO mesurmentapi.samples SET ?', { sampleDate: data.time, sampleSensorId: 1, sampleValue: data.sampleValue }, function(error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
        res.status(200).end("");
    });
})



var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})