var express = require('express')
  , router = express.Router()
  , bikeRoutes = router.route('/')
var database = require("../databaseConnection");
var db1 = database.db1();
var getdata=db1.collection("totaldatacol");
var moment = require("moment");
var momentz = require("moment-timezone");

bikeRoutes.post(function (req, res) {
console.log("request received for query at " + moment()._d);
   var received = req.body;
   console.log("data received at " + moment()._d);
 // console.log("the format received through request");
  received = JSON.parse(received);
  console.log(received);
 

	console.log("received start date");
  console.log(received.startDate);
  console.log("received end date");
  console.log(received.endDate);
 
 //storing these in variables
   var startDate = received.startDate;
   var endDate = received.endDate;
  
// console.log("Accessing individual start date parameters");
  //directly we wont able to access individual date/month/year etc
  // converting that to moment object
  startDate = moment(startDate);
  endDate = moment(endDate);
  /*
  console.log("After converting into moment objects");
  console.log(startDate);
  console.log(endDate); 
 */
 // newDate(year,month,date)

  var fromDate = new Date(startDate.year(),startDate.month(),startDate.date());
	// var fromDate = startDate.toISOString();  
  // fromDate = moment(fromDate);
  // fromDate = momentz.tz(fromDate._d,'GMT');
  // fromDate = fromDate._i;

  var toDate = new Date(endDate.year(),endDate.month(),endDate.date());
  // var toDate = endDate.toISOString();
  // toDate = moment(toDate);
  // toDate = momentz.tz(toDate._d,'GMT');
  // toDate = toDate._i;


  console.log("going to query with the following dates");
  console.log(fromDate);
  console.log(toDate);

  // var isoFromDate = new Date(startDate);
  // var isoToDate = new Date(endDate);

  // console.log(isoFromDate);
  // console.log(isoToDate);

    res.write('hello bikes');
    getdata.aggregate([ {$unwind :'$totalData'},{$match:{"totalData.date":{"$gte":fromDate}}}],function(err,docs){
    	if(err){
    		console.log(err);
    		return 0;
    	}
    	else{
    		console.log(docs);
    		res.write(JSON.stringify(docs));
    		res.end();
    		return 0;
    	}
    });
    //console.log("body successfully received");
});
bikeRoutes.post(function(req,res){
	if(req.body=="1")res.write("You sent 1 as parameter")
	else res.write("You sent other than 1 as parameter")
});

module.exports = bikeRoutes
module.exports = router
