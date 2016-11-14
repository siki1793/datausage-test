
var express = require('express')
, router = express.Router()
, newsync = router.route('/')
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var security = require("../encryption.js"); 
var database = require("../databaseConnection.js");
var path = require('path');
var db1 = database.db1();


/*
sync_data.get(function (req, res) {
    res.send('hello sync data');
    console.log("sync_data routes was called");
});

 */

newsync.post(function(req,res){

	// decrypting the message received	
	try {
		console.log("req handler 'newsync' was called.");

		//console.log(req.body);
		//console.log("data received");
		var received = req.body;
		//var received = security.decipher(received);
		//console.log("After decryption");
		console.log(received);
		received = JSON.parse(received);
		//parsing the decrypted message
		//console.log(received);

	


		var coll = "newdatainfo";
		var getlogs = db1.collection(coll);
		/*getlogs.find({},function(err,docs){
			if(err){console.log(err);}
			console.log("database response")					
		})
		 */
		getlogs.find({"imei" : received.imei},function(err,docs){
			if(err){
				console.log(err);
			}
			else{
				//console.log("find IMEI in database to check new user or not");
				//console.log("displaying results");
				//console.log(docs);
				if(docs.length == 0){
					// if length of docs is 0 it means user is new
					// add the document as it is by changing the date to Dateobject and add server time
					console.log("new user requesting");

					for ( var i = 0; i< received.data.length;i++) {
						serverDate = new Date();
						//offset = date.getTimezoneOffset() * 60000;
						//date = new Date(date.valueOf() - offset);
						console.log(received.data[i].date);
						received.data[i].date = new Date(received.data[i].date);
						console.log(received.data[i].date);
						console.log(received.data[i].date.toISOString());
						received.data[i].server_synctime = serverDate;
						//received[i].server_synctime = date.toISOString();
						received.data[i].ip = req.connection.remoteAddress;
					}

					getlogs.insert(received,function(err,doc){
						if(err){
							console.log(err);
							res.write(0);
							res.end();
						}
						else{

										console.log("hello2");
										console.log("successfully synced data " + req.connection.remoteAddress);
										//res.end();   // close connection
										res.write("inserted into database"); 
										res.end();
						}	 //end else
					}); // end insert query
				}// end if condition
				else{
					// get current id 
					console.log("in else");
					getlogs.aggregate([{$match : {"imei" : received.imei}},{$project : { "_id":0, "imei" : 1 } }],function(err,docid){
						if(err){
							console.log(err);
						}
						else{
								console.log("Updating recieved data")
								for ( var i = 0; i< received.data.length;i++) {
									serverDate = new Date();
									received.data[i].date = new Date(received.data[i].date);
									received.data[i].server_synctime = serverDate;
									received.data[i].ip = req.connection.remoteAddress;
								}
								console.log(" recieved data updated.....")
								console.log("Strting updation into database...")
					
								getlogs.update({"imei" : received.imei},{$push : { data:{$each: received.data }}},function(err){
									if(err){
										console.log(err);
										console.log("error in writing to database");
										res.end();
									}
									else{console.log("successfully updated into db...no error detected");
												console.log("hello3");
												console.log("successfully synced data " + req.connection.remoteAddress);
												console.log("Data got updated!!");
												res.write("Successfully inserted into database");
												res.end();   // close connection

										//	}

										 //end update
									};
								});

							//}
						}
					});

				}
			} //end first else

		}); // end getlogs find 
	}
	catch (e) {
		console.log("failed to decrypt from " + req.connection.remoteAddress);
		res.write("Some exception is there"); // decrypt error
		//res.end();
		console.log(e);

	}// catch else			




}); //end sync data




module.exports = newsync
module.exports = router
