/**
 * http://usejsdoc.org/
 */
var express = require('express');
var app = express();
var router = express.Router();
//var apiRoute = router.route('/api');
//var bikeRoutes = require('./bikes');

//starting the server
var server = app.listen(8888, function () {

	var host = server.address().address
	var port = server.address().port
	console.log("Server has started");
	console.log("listening at http://%s:%s", host, port);

});
// home page route (http://localhost:8080)
router.get('/', function(req, res) {
    res.send('im the home page!');  
});

// about page route (http://localhost:8080/about)
router.get('/about', function(req, res) {
    res.send('im the about page!'); 
});

// route with parameters (http://localhost:8080/hello/name)
router.get('/hello/:name', function(req, res) {
    res.send('hello ' + req.params.name + '!');
});

// route middleware to validate :name
router.param('name', function(req, res, next, name) {
    // do validation on name here
    // blah blah validation
    // log something so we know its working
    console.log('doing name validations on ' + name);

    // once validation is done save the new item in the req
    req.name = name;
    // go to the next thing
    next(); 
});

router.route('/login')

    // show the form (GET http://localhost:8080/login)
    .get(function(req, res) {
        res.send('this is the login form');
    })

    // process the form (POST http://localhost:8080/login)
    .post(function(req, res) {
        console.log('processing');
        res.send('processing the login form!');
    });


// apply the routes to our application
app.use('/', router);


