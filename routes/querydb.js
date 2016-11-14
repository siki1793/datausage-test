var express = require('express')
, router = express.Router()
  , query = router.route('/')

var moment = require("moment");
var momentz = require("moment-timezone");
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var security = require("../encryption.js"); 
var database = require("../databaseConnection.js");
var path = require('path');
var db = database.db1();

var coll = 'logs';
var getdata = db.collection(coll);


var jsonFile = path.join(__dirname,"plot.json");	
//standard variables for the 5 sessions assumed
// Here only time is matter date is just dummy and for representation


//dummy date,month and year only time is valid
var morning_start = moment("2015-05-26T06:00:00.000+0530");  // creating to a moment object
var morning_end = moment("2015-05-26T11:00:00.000+0530");
morning_start = momentz.tz(morning_start._d,'GMT');  	     // converting to GMT timezone as required by mongodb,but momentz cannot access individual hours,minitues	
morning_end = momentz.tz(morning_end._d,'GMT');
morning_start = moment.utc(morning_start.format()); //so converting it again to moment object
morning_end = moment.utc(morning_end.format());

var morning_start = moment("2015-05-26T11:30:00.000+0530");  // creating to a moment object
var morning_end = moment("2015-05-26T16:30:00.000+0530");
morning_start = momentz.tz(morning_start._d,'GMT');  	     // converting to GMT timezone as required by mongodb,but momentz cannot access individual hours,minitues	
morning_end = momentz.tz(morning_end._d,'GMT');
morning_start = moment.utc(morning_start.format()); //so converting it again to moment object
morning_end = moment.utc(morning_end.format());

var afternoon_start = moment("2015-05-26T16:30:00.000+0530"); // can be entered as per local format with offset
var afternoon_end = moment("2015-05-26T21:30:00.000+0530");
afternoon_start = momentz.tz(afternoon_start._d,'GMT');
afternoon_end = momentz.tz(afternoon_end._d,'GMT');
afternoon_start = moment.utc(afternoon_start.format());
afternoon_end = moment.utc(afternoon_end.format());	// we will get according to utc solving offset issues

var evening_start = moment("2015-05-26T21:30:00.000+0530");
var evening_end = moment("2015-05-26T01:30:00.000+0530");
evening_start = momentz.tz(evening_start._d,'GMT');
evening_end = momentz.tz(evening_end._d,'GMT');
evening_start = moment.utc(evening_start.format());
evening_end = moment.utc(evening_end.format());

var night_start = moment("2015-05-26T01:30:00.000+0530");
var night_end = moment("2015-05-26T06:30:00.000+0530");
night_start = momentz.tz(night_start._d,'GMT');
night_end = momentz.tz(night_end._d,'GMT');
night_start = moment.utc(night_start.format());
night_end = moment.utc(night_end.format());

var earlymorning_start = moment("2015-05-26T06:30:00.000+0530");
var earlymorning_end = moment("2015-05-26T11:30:00.000+0530");
earlymorning_start = momentz.tz(earlymorning_start._d,'GMT');
earlymorning_end = momentz.tz(earlymorning_end._d,'GMT');
earlymorning_start = moment.utc(earlymorning_start.format());
earlymorning_end = moment.utc(earlymorning_end.format())
// defualt date is one month back from the current date for querying
// if the user didnt specify date last one month is considered,
var toDate = moment()._d;
var fromDate = moment().subtract('1','month').startOf('day')._d;

query.post(function(req,res){

// call back counter 

	var callbackCounter = 0;
	var getData = function(session){
		/*
		console.log("in function getData");
		console.log("from Date");
		console.log(fromDate);
		console.log("to date");
		console.log(toDate);
               
		var sessionStartHours;
		var sessionStartMinutes; 
		var sessionEndHours;
		var sessionEndMinutes;
		*/
		switch(session){
		case "Morning" : 
							sessionStartHours = morning_start.hours();
							sessionStartMinutes = morning_start.minutes();
				            sessionEndHours = morning_end.hours();
							sessionEndMinutes = morning_end.minutes();
							break;
		case "AfterNoon" : 
							sessionStartHours = afternoon_start.hours();
							sessionStartMinutes = afternoon_start.minutes();
							sessionEndHours = afternoon_end.hours();
							sessionEndMinutes = afternoon_end.minutes();
							break;

		case "Evening" : 
							sessionStartHours = evening_start.hours();
							sessionStartMinutes = evening_start.minutes();
							sessionEndHours = evening_end.hours();
							sessionEndMinutes = evening_end.minutes();
							break;
		case "Night" : 
							sessionStartHours = night_start.hours();
							sessionStartMinutes = night_start.minutes();
							sessionEndHours = night_end.hours();
							sessionEndMinutes = night_end.minutes();
							break;
		case "Early Morning" : 
							sessionStartHours = earlymorning_start.hours();
							sessionStartMinutes = earlymorning_start.minutes();
							sessionEndHours = earlymorning_end.hours();
							sessionEndMinutes = earlymorning_end.minutes();
							break;	
							
		}
		

		
		getdata.aggregate([{$unwind : '$data' },{$match : { "data.date" : { "$gte" : fromDate,"$lte" : toDate}}},
		               	                 
		             	                   {$project :{ "time" : { "$add": [
		             	                                                    { "$hour": "$data.date" },
		             	                        	                        { "$divide": [{ "$minute": "$data.date" }, 60] }
		             	                        	                    ]}, "data.date" : 1,"data.txwifi":1,"data.rxwifi" : 1,"data.txcell" : 1, "data.rxcell" :1, "_id" : 0  } },
		             	                   {$match :  { "$and": [
		             	                                          { "time" : { "$gt":  sessionStartHours + (sessionStartMinutes/60)}},
		             	                                          
		             	                                          { "time" :{ "$lt":   sessionEndHours + (sessionEndMinutes/60) }}
		             	                                        ] },
		             	                   	},
		             	                          
		             	     { $group: {_id : null,
		             		 totalTxWifi : { $avg : "$data.txwifi"},
		             		 totalRxWifi : { $avg : "$data.rxwifi"},
		             		 totalTxCell : { $avg : "$data.txcell"},
		             		 totalRxCell : { $avg : "$data.rxcell"} } 
		              } ],function(err,docs){
		             		if(err){
		             			console.log(err);
		             			return 0;
		             		}
		             		else{			
		             			var session_data = [];
		             		
		             			//console.log(session);
		             			//console.log(docs);
		             			
		             				var y_variables = ["totalTxWifi","totalRxWifi","totalTxCell","totalRxCell" ];
		             				//var x_variables = ["Morning", "AfterNoon", "Evening", "Night", "Early Morning"];
		             				var givejson = function(session_val, data_type, data_val){
		             					var plotjson = {
		             							"Session" : session_val,
		             							"type" : data_type,
		             							"data" : data_val
		             							};
		             					return plotjson;
		             				};
		             				
		             				
		             				if(docs.length == 0){	
		             							
		             				    for(var j=0; j< 4; j++){
		             				    	
		             				    	var empty = givejson(session,y_variables[j],0);
		             				    	session_data.push(empty);
		             					//fs.appendFileSync(jsonFile, JSON.stringify(empty));
		             				    }
		             					
		             				}
		             				else{
		             						//console.log("success");
		             						//console.log(docs.length);
		             					for(var i =0 ; i < docs.length;i++){ // this for loop has no significance, any way length would be 1  
		             						docs[i].Session = session;
		             					        //console.log(docs[i]);	
		             						//console.log("hello");
		             						//console.log(docs[i].date.toISOString());
		             					    var jsondata = givejson(session,"totalTxWifi",docs[i].totalTxWifi);
		             					    session_data.push(jsondata);
		             					    //fs.appendFileSync(jsonFile, JSON.stringify(jsondata));
		             					    jsondata = givejson(session,"totalRxWifi",docs[i].totalRxWifi);
		             					    session_data.push(jsondata);
		             					    //fs.appendFileSync(jsonFile, JSON.stringify(jsondata));
		             					    jsondata = givejson(session,"totalTxCell",docs[i].totalTxCell);
		             					    session_data.push(jsondata);
		             					    //fs.appendFileSync(jsonFile, JSON.stringify(jsondata));
		             					    jsondata = givejson(session,"totalRxCell",docs[i].totalRxCell);
		             					    session_data.push(jsondata);
		             					    //fs.appendFileSync(jsonFile, JSON.stringify(jsondata));
		             					    }
		             					}
		                                         //console.log("in inner function");
							 //console.log("session data");
		             				 //console.log(session_data);
							 //console.log("data to send");
							 //console.log(datatosend);
		             				 datatosend = datatosend.concat(session_data);
							 //console.log("After concatination");
		             				 console.log(datatosend)
		             				
		             				}
						callbackCounter++;
						if(callbackCounter === 5){
							res.set("Access-Control-Allow-Origin", "*");
	  						console.log("sending the data as per request at " + moment()._d);
							//console.log(datatosend);
	  						res.write(JSON.stringify(datatosend));
							console.log("sent the data as per request at  " + moment()._d);	  				
							res.end();
						}
		             		});
		
};
	
  console.log("request received for query at " + moment()._d);
   var received = req.body;
   console.log("data received at " + moment()._d);
 // console.log("the format received through request");
  received = JSON.parse(received);
  console.log(received);
 
 /* console.log("received start date");
  console.log(received.startDate);
  console.log("received end date");
  console.log(received.endDate);
 */ 
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
/*  
  toDate = moment(toDate);
  toDate = momentz.tz(toDate._d,'GMT');           // _i contain time according to gmt in final variables of from date and to date  
  toDate = moment.utc(toDate.format());
  toDate = toDate._i;            // _d contains as per local time in final variables of from date and to date

  console.log("created new date object from received start date");
  console.log(fromDate);
  console.log("created new date object from received to date");
  console.log(toDate);

*/  
  
  
  var datatosend = [];
  var session_array = ["Morning", "AfterNoon", "Evening", "Night", "Early Morning"];
  for(var i=0;i<5;i++){
	  getData(session_array[i]);
	  
  }
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


module.exports = query
module.exports = router









