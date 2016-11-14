var express = require('express')
  , router = express.Router()
  , bikeRoutes = router.route('/')
var database = require("../databaseConnection");
var db1 = database.db1();

bikeRoutes.get(function (req, res) {
    res.write('hello bikes');
    console.log("bike routes was called");
    res.end();
    //console.log("body successfully received");
});
bikeRoutes.post(function(req,res){
	if(req.body=="1")res.write("You sent 1 as parameter")
	else res.write("You sent other than 1 as parameter")
});

module.exports = bikeRoutes
module.exports = router
