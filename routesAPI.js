module.exports = function(app, pool, authenticate, cookieParser) {

    var qs = require('querystring');
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
            sql = 'INSERT INTO stations SET stationsNumber =' + data.number + ' ,  stationsName= ' + pool.escape(data.name) + ' ,  stationsDesc= ' + pool.escape(data.description);
            console.log(sql);
            handle_database(req, res, sql, queryResultsAsJson);
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
            sql = 'SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber  FROM sensors  INNER JOIN stations ON sensors.sensorStationId =stations.idstations where stations.stationsNumber= ' + pool.escape(stationNumber);
        } else {
            sql = 'SELECT sensorsName,sensorsNumber,sensorsDesc,stationsNumber  FROM sensors  INNER JOIN stations ON sensors.sensorStationId =stations.idstations where sensors.sensorsNumber= ' + pool.escape(id) + ' and stations.stationsNumber= ' + pool.escape(stationNumber);
        }
        console.log(sql);
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
            sql = 'insert into sensors (sensorsName,sensorsNumber,sensorsDesc,sensorStationId) select ' +
                pool.escape(data.name) + ' , ' + pool.escape(data.number) + ' , ' + pool.escape(data.description) + ' , idstations from stations where stationsNumber = ' + pool.escape(data.stationsNumber);
            console.log(sql);
            handle_database(req, res, sql, queryResultsAsJson);

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
        console.log(sensor);
        console.log(station);
        var firstIndex = query.firstIndex;
        var lastIndex = query.lastIndex;
        if (!firstIndex) { firstIndex = 0; }
        if (!lastIndex) { lastIndex = 1000; }
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
            sql += 'where stationsNumber = ' + pool.escape(station) + ' and  sensorsNumber = ' + pool.escape(sensor);
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
            var sql =
                'insert into samples (sampleValue,samples.sampleDate,samples.sampleSensorId) ' +
                'select ' + data.sampleValue + ' , ' + pool.escape(data.time) + ' ,  sensors.idsensors from sensors inner join stations on sensorStationId = idstations where sensorsNumber =' + pool.escape(data.sensorsNumber) + '  and stationsNumber = ' + data.stationsNumber;
            console.log(sql);
            handle_database(req, res, sql, queryResultsAsJson);
        });
    })

    app.delete('/sample', function(req, res) {
        var sql = 'delete samples FROM samples INNER JOIN sensors ON samples.sampleSensorId = idsensors inner join stations on sensors.sensorStationId = idstations WHERE  stationsNumber = 1 and sensorsNumber = 3';
    })
}
