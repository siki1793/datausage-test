var express = require('express')
  , router = express.Router()
  , getCoordinates = router.route('/');
var database = require("../databaseConnection");
var db = database.db1();

getCoordinates.get(function (req, res) {

	var coll = "logs";
	var getCoordinates = db.collection(coll);
	
    getCoordinates.find({},{"data.latitude" :1 ,"data.longitude":1,"number":1},function(err,data){
		if(err){
			 console.log(err);
			}
		else{
		
			console.log("request received for GET coordinates");
			console.log(data);		
			res.set("Access-Control-Allow-Origin", "*");
			datatosend = JSON.stringify(data);
			res.write(datatosend);		
			res.end();
						
		}
	});
});


module.exports = getCoordinates;
module.exports = router;
