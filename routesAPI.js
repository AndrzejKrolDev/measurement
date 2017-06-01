module.exports = function(app,pool){

var mysql = require('mysql');
//Handles db queries
function handle_database(req, res, query, responseFunc) {
    pool.getConnection(function(err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }
        connection.query(query, function(err, rows) {
            connection.release();
            if (!err) {
                console.log(responseFunc);
                responseFunc(rows, res, req, query);
            } else {
                res.json(err)
            }
        });
        connection.on('error', function(err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });
}


//Returns db set as Json
function queryResultsAsJson(rows, res) {
    res.json(rows);
}


//Stations
app.get(['/station/:id', '/station'], function(req, res) {
    var sql
    if (req.params.id) {
        sql = "SELECT stationsName,stationsNumber,stationsDesc from stations AS solution where stationsNumber = ?";
        var inserts = [req.params.id];
        sql = mysql.format(sql, inserts);
        console.log(sql);
    } else {
        sql = "SELECT stationsName,stationsNumber,stationsDesc from stations AS solution where stationsNumber ";
    }
    handle_database(req, res, sql, queryResultsAsJson);
});

//AddSingleStation
app.post('/station', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {
        var data = qs.parse(body);
        connection.query('INSERT INTO stations SET ?', { stationsNumber: data.number, stationsName: data.name, stationsDesc: data.description }, function(error, results, fields) {
            if (error) res.status(500).end();;
            console.log(results.insertId);
        });
        res.status(200).end();
    });
})

//Remove Station
app.delete('/station/:id', function(req, res) {
    sql = "Delete  from stations where stationsNumber = " + pool.escape(req.params.id);
    handle_database(req, res, sql, queryResultsAsJson);
});


//Sensors
app.get(['/sensor/:id', '/sensor'], function(req, res) {
    var id = req.params.id;
    var query = require('url').parse(req.url, true).query;
    var sql;
    var stationNumber = query.station;
    console.log(stationNumber);
    if (!stationNumber && !id) {
        sql = 'SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber FROM sensors INNER JOIN stations ON sensors.sensorStationId =stations.idstations';
    } else if (id && !stationNumber) {
        console.log(2);
        sql = 'SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber FROM sensors INNER JOIN stations ON sensors.sensorStationId =stations.idstations where sensors.sensorsNumber = ' + pool.escape(id);
    } else if (!id && stationNumber) {
        sql = 'SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber  FROM mesurmentapi.sensors  INNER JOIN mesurmentapi.stations ON mesurmentapi.sensors.sensorStationId =mesurmentapi.stations.idstations where stations.stationsNumber= ' + pool.escape(stationNumber);
    } else {
        sql = 'SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber  FROM mesurmentapi.sensors  INNER JOIN mesurmentapi.stations ON mesurmentapi.sensors.sensorStationId =mesurmentapi.stations.idstations where mesurmentapi.sensors.sensorsNumber= ' + pool.escape(id) + ' and stations.stationsNumber= ' + pool.escape(stationNumber);
    }
    handle_database(req, res, sql, queryResultsAsJson);
})


app.post('/sensor', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    var stationId;
    req.on('end', function() {
        var data = qs.parse(body);
        connection.query('SELECT idstations from stations AS solution where stationsNumber =?', [data.stationNumber], function(error, results, fields) {
            if (error) throw error;
            stationId = (results[0].idstations);
            connection.query('INSERT INTO sensors SET ?', { sensorsNumber: data.number, sensorsName: data.name, sensorsDesc: data.description, sensorStationId: stationId }, function(error, results, fields) {
                if (error) throw error;
                console.log(results.insertId);
            });

            res.status(200).end("");
        });
    });
})

app.delete('/sensor/:id', function(req, res) {
    var query = require('url').parse(req.url, true).query;
    var station = query.station;
    sql = "DELETE FROM sensors se INNER JOIN stations st ON sensorStationId=idstations WHERE sensorsNumber = " + pool.escape(req.params.id) + " AND stationsNumber= " + station;
    var inserts = [req.params.id];
    sql = mysql.format(sql, inserts);
    console.log(sql);
    handle_database(req, res, sql, queryResultsAsJson);
});

//sample
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
    var sql = 'SELECT sampleDate,sampleValue ,sensorsNumber,stationsNumber ' +
        'FROM samples ' +
        'INNER JOIN sensors ' +
        'ON sensors.idsensors =sampleSensorId ' +
        'INNER JOIN stations ' +
        'on sensorStationId =idstations ';
    if (startDate && endDate && station && sensor) {
        sql += 'where stationsNumber = ' + pool.escape(station) + ' and  sensorsNumber = ' + pool.escape(sensor) + ' and  sampleDate <' + pool.escape(endDate) + ' and sampleDate > ' + pool.escape(startDate);
    } else if (startDate && endDate && station) {
        sql += 'where stationsNumber = ' + pool.escape(station) + ' and  sampleDate <' + pool.escape(endDate) + ' and sampleDate > ' + pool.escape(startDate);
    } else if (startDate && endDate) {
        sql += 'where  sampleDate <' + pool.escape(endDate) + ' and sampleDate > ' + pool.escape(startDate);
    } else if (station && sensor) {
        'where stationsNumber = ' + pool.escape(station) + ' and  sensorsNumber = ' + pool.escape(sensor);
    } else if (station) {
        sql += 'where stationsNumber = ' + pool.escape(station);
    }

    sql += ' Limit ' + firstIndex + ',' + lastIndex;
    console.log(sql);
    handle_database(req, res, sql, queryResultsAsJson);
})

app.post('/sample', function(req, res) {
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    req.on('end', function() {
        var data = qs.parse(body);
        connection.query('INSERT INTO samples SET ?', { sampleDate: data.time, sampleSensorId: 1, sampleValue: data.sampleValue }, function(error, results, fields) {
            if (error) throw error;
            console.log(results.insertId);
        });
        res.status(200).end("");
    });
})


}