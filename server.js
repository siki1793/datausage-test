var http = require("http");
var express = require('express');
var app = express();
var router = express.Router()
var bodyParser = require("body-parser");
var server = require('./server');
var bikeRoutes = require('./routes/bikes');
var sync_data = require('./routes/synchronise');
var query = require('./routes/allUserQuery');
var appwise = require('./routes/appWiseData');
var query_individual = require('./routes/querydb_individual')
var getMobileNumbers = require('./routes/sendMobileNumbers');
var getCoordinates=require('./routes/sendCoordinates')
var newsync=require('./routes/newsync');
var registration=require('./routes/registration');
var login=require('./routes/login');
var sync=require('./routes/sync');

app.use(bodyParser.text());

//apply the routes to our application

app.use('/bikes', bikeRoutes);
app.use('/sync_data',sync_data);
app.use('/new_sync',newsync);

app.use('/query',query);
app.use('/appwise',appwise);
app.use('/get_mbnum',getMobileNumbers);
app.use('/query_individual',query_individual);
app.use('/get_coor',getCoordinates)
app.use('/registration',registration);
app.use('/login',login);
app.use('/test',sync);


var port_number = process.env.PORT || 3000;
var server = app.listen(port_number, function () {

	var host = server.address().address
	var port = server.address().port
	console.log("Server has started");
	console.log(host);
	console.log("listening at http://%s%s", host, port);

});
	
