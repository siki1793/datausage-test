var express = require('express')
  , router = express.Router()
  , getMobileNumbers = router.route('/');
var database = require("../databaseConnection");
var db = database.db1();

getMobileNumbers.get(function (req, res) {

	var coll = "logs";
	var getNumbers = db.collection(coll);
	
    getNumbers.find({},{"number" : 1, "_id" : 0 },function(err,data){
		if(err){
			 console.log(err);
			}
		else{
		
			console.log("request received for GET mobile numbers");
			console.log(data);		
			res.set("Access-Control-Allow-Origin", "*");
			datatosend = JSON.stringify(data);
			res.write(datatosend);		
			res.end();
						
		}
	});
    
				
});


module.exports = getMobileNumbers;
module.exports = router;
