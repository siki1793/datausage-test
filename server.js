var http = require("http");
var express = require('express');
var app = express();
var router = express.Router()
var bodyParser = require("body-parser");
var server = require('./server');
var bikeRoutes = require('./routes/bikes');
var sync_data = require('./routes/synchronise');
var query = require('./routes/querydb.js');
var query_individual = require('./routes/querydb_individual.js')
var getMobileNumbers = require('./routes/sendMobileNumbers.js');
var getCoordinates=require('./routes/sendCoordinates.js')
var newsync=require('./routes/newsync');
var registration=require('./routes/registration');
var login=require('./routes/login.js');
var sync=require('./routes/sync.js');
//var database = require("../databaseConnection");
//var db1 = database.db1();
//var query = require('./routes/query');

//var expressMongoDb = require('express-mongo-db');
//app.use(expressMongoDb('mongodb://localhost/mobiledata'));



//app.use(bodyParser.json());
app.use(bodyParser.text());
//app.use(bodyParser.raw());
//app.use(bodyParser.urlencoded({ extended: false }));
/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

*/


//apply the routes to our application

app.use('/bikes', bikeRoutes);
app.use('/sync_data',sync_data);
app.use('/new_sync',newsync);

app.use('/query',query);
app.use('/get_mbnum',getMobileNumbers);
app.use('/query_individual',query_individual);
app.use('/get_coor',getCoordinates)
app.use('/registration',registration);
app.use('/login',login);
app.use('/test',sync);
//console.log(server);
//console.log(request.connection.remoteAddress);
var server = app.listen(8888, function () {

	var host = server.address().address
	var port = server.address().port
	console.log("Server has started");
	console.log(host);
	console.log("listening at http://%s%s", host, port);

});
	
