/**
 * http://usejsdoc.org/
 */
var express = require('express');
var app = express();
var bikeRoutes = require('./routes/bikes');

//starting the server
var server = app.listen(8888, function () {

	var host = server.address().address
	var port = server.address().port
	console.log("Server has started");
	console.log("listening at http://%s:%s", host, port);

});

// apply the routes to our application
app.use('/bikes', bikeRoutes);

