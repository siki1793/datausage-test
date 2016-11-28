var express = require('express')
, router = express.Router()
  , appWiseData = router.route('/')

var moment = require("moment");
var momentz = require("moment-timezone");
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var security = require("../encryption.js"); 
var database = require("../databaseConnection.js");
var path = require('path');
var db = database.db1();

var coll = 'appwisecol';
var getdata = db.collection(coll);


var jsonFile = path.join(__dirname,"plot.json");	
//standard variables for the 5 sessions assumed
// Here only time is matter date is just dummy and for representation


// defualt date is one month back from the current date for querying
// if the user didnt specify date last one month is considered,
var toDate = moment()._d;
var fromDate = moment().subtract('1','month').startOf('day')._d;

appWiseData.post(function(req,res){

// call back counter 

	
	
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
  /*
  fromDate = moment(fromDate);
  fromDate = momentz.tz(fromDate._d,'GMT');
  fromDate = moment.utc(fromDate.format());
  fromDate = fromDate._i;
*/
  var toDate = new Date(endDate.year(),endDate.month(),endDate.date());
  console.log("going to query with the following dates");
  console.log(fromDate);
  console.log(toDate);

  
getdata.aggregate([{$unwind:"$applicationData"},{$match:{"applicationData.date":{"$gte":fromDate,"$lte":toDate}}},{$project:{"applicationData.uid":1,"applicationData.applicationName":1,"applicationData.applicationRX":1,"applicationData.applicationTX":1,"applicationData.applicationTotal":1,"_id":0}},{$group:{"_id":"$applicationData.applicationName",applicationTotal:{$avg:"$applicationData.applicationTotal"},applicationRX:{$avg:"$applicationData.applicationRX"},applicationTX:{$avg:"$applicationData.applicationTX"}}},{$sort:{"applicationTotal":-1}},{$limit:10}],

	function(err,docs){
		if(err){
			console.log(err);
			return 0;
		}
		else{
      res.set("Access-Control-Allow-Origin", "*");
			datatosend = JSON.stringify(docs);
			res.write(datatosend);		
			res.end();
		}
	});


  
  
  
/*
  if(i === 5 ){
	  res.set("Access-Control-Allow-Origin", "*");
	  
	  
	  //datatosend = datatosend.concat(morningjson,afternoonjson,eveningjson,nightjson,earlymorningjson);
	  console.log(datatosend);
	  console.log("sending the data as per request");
	  res.write(JSON.stringify(datatosend));
	  res.end();
  }
  
*/
  //each of the below variables contains array of json data for each session returned by the getData function
  /*
  var morningjson = getData(fromDate,toDate,morning_start.hours(),morning_start.minutes(),morning_end.hours(),morning_end.minutes(),"Morning");
  var afternoonjson = getData(fromDate,toDate,afternoon_start.hours(),afternoon_start.minutes(),afternoon_end.hours(),afternoon_end.minutes(),"AfterNoon");
  var eveningjson = getData(fromDate,toDate,evening_start.hours(),evening_start.minutes(),evening_end.hours(),evening_end.minutes(),"Evening");
  var nightjson = getData(fromDate,toDate,night_start.hours(),night_start.minutes(),night_end.hours(),night_end.minutes(),"Night");
  var earlymorningjson = getData(fromDate,toDate,earlymorning_start.hours(),earlymorning_start.minutes(),earlymorning_end.hours(),earlymorning_end.minutes(),"Early Morning");
*/
//Allow the response to be sent to cross servers
  
  //startDate and endDate are the variables received from angular through json in the format of string
  
  
  
  
});


//this function is useful in future if get the month '5' and we are interested in converting that to '05' as per standard ISO format
var pad = function(num) {
    var norm = Math.abs(Math.floor(num));
    return (norm < 10 ? '0' : '') + norm;
};


module.exports = appWiseData
module.exports = router









