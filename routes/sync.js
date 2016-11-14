
var express = require('express')
, router = express.Router()
, sync = router.route('/')
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

sync.post(function(req,res){

	// decrypting the message received	
	try {
		console.log("req handler 'test' was called.");

		//console.log(req.body);
		//console.log("data received");
		var received = req.body;
		//var received = security.decipher(received);
		//console.log("After decryption");
		console.log(received);
		received = JSON.parse(received);
		//parsing the decrypted message
		//console.log(received);

	


		var coll1 = "totaldatacol";
		var coll2="appwisecol";

		var totaldatacol = db1.collection(coll1);
		var appwisecol=db1.collection(coll2);
		//var updater=db1.collection("updater");
		//var splitedUserData=db1.collection("splitedUserData");
		/*getlogs.find({},function(err,docs){
			if(err){console.log(err);}
			console.log("database response")					
		})
		 */
		/*if(received.reset){
			updater.delete({},function(err){
				if(err){console.log(err);}
				else{
					for ( var i = 0; i< received.data.length;i++) {//updating data with sunc time and ip address
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
					}//closing for loop
					updater.insert(received,function(err,doc){
							if(err){console.log(err);}
							else{
								splitedUserData.aggregate([{$match : {"imei" : received.imei}},{$project : { "_id":0, "imei" : 1 } }],function(err,docid){
									if(err){colsole.log(err);}
									else{
										if(docid.length==0){
											splitedUserData.insert(recieved,function(err,doc){
												if(err){console.log(err);
														
												}
												else{
													console.log("new user data inserted!");
													res.write("new user data inserted!");
														res.end();
												}
											});
										
										}//closing if docid.length
										else{
											splitedUserData.update({"imei":received.imei},{$push : { data:{$each: received.data }}},function(err,docv){
												if(err){console.log(err);}
												else{
													console.log("already existing users data updated!");
													res.write("existing users data updated!");
													res.end();

												}//else closing
											});//update query closing
										}//else closing
													}//closing else bada wala
								});

							}
					});//updater insert closing

				}//else closing
			});//after function closing)
			}//updater.delete closing
			else{

			}//closing else if restart is false
		//}

	*/





		totaldatacol.find({"imei" : received.imei},function(err,docs){
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
						serverDate = new Date();
						console.log(received.totalData[0].date);
						received.totalData[0].date = new Date(received.totalData[0].date);
						console.log(received.totalData[0].date);
						console.log(received.totalData[0].date.toISOString());
						received.totalData[0].server_synctime = serverDate;
					
					for ( var i = 0; i< received.applicationData.length;i++) {
						//offset = date.getTimezoneOffset() * 60000;
						//date = new Date(date.valueOf() - offset);
						console.log(received.applicationData[i].date);
						received.applicationData[i].date = new Date(received.applicationData[i].date);
						console.log(received.applicationData[i].date);
						console.log(received.applicationData[i].date.toISOString());
						received.applicationData[i].server_synctime = serverDate;
						//received[i].server_synctime = date.toISOString();
						received.applicationData[i].ip = req.connection.remoteAddress;
					}

					totaldatacol.insert({"mobileNumber":received.mobileNumber,"imei":received.imei,"totalData":received.totalData},function(err,doc){
						if(err){
							console.log(err);
							res.write(0);
							res.end();
						}
						else{
								console.log("successfully entered into totaldatacol!!");
										appwisecol.insert({"mobileNumber":received.mobileNumber,"imei":received.imei,"applicationData":received.applicationData},function(err,doc){
											if(err){
												console.log(err);
												res.write(0);
												res.end();

											}
											else{
												console.log("successfully entered into appwisecol");
												console.log("successfully synced data " + req.connection.remoteAddress);
												res.write("inserted into database"); 
												res.end();
											}
										
										}); 		

						}				
					}); // end insert query
				}// end if condition
				else{
					// get current id 
					console.log("in else");
					totaldatacol.aggregate([{$match : {"imei" : received.imei}},{$project : { "_id":0 ,"imei":1} }],function(err,docid){
						if(err){
							console.log(err);
						}
						else{
								console.log("Updating recieved data")
								serverDate = new Date();
								console.log(received.totalData[0].date);
								received.totalData[0].date = new Date(received.totalData[0].date);
								console.log(received.totalData[0].date);
								console.log(received.totalData[0].date.toISOString());
								received.totalData[0].server_synctime = serverDate;
							
							for ( var i = 0; i< received.applicationData.length;i++) {
								//offset = date.getTimezoneOffset() * 60000;
								//date = new Date(date.valueOf() - offset);
								console.log(received.applicationData[i].date);
								received.applicationData[i].date = new Date(received.applicationData[i].date);
								console.log(received.applicationData[i].date);
								console.log(received.applicationData[i].date.toISOString());
								received.applicationData[i].server_synctime = serverDate;
								//received[i].server_synctime = date.toISOString();
								received.applicationData[i].ip = req.connection.remoteAddress;
							}
							console.log(" recieved data updated.....")
								console.log("Strting updation into database...")
					
								totaldatacol.update({"imei" : received.imei},{$push : { totalData:{$each: received.totalData }}},function(err){
									if(err){
										console.log(err);
										console.log("error in writing to database");
										res.end();
									}
									else{
										console.log("successfully updated into totaldatacol!!");
										appwisecol.update({"imei":received.imei},{$push:{applicationData:{$each:received.applicationData}}},function(err){
											if(err){console.log(err);}
											else{
												console.log("successfully updated into appwisecol!!");
												console.log("successfully synced data " + req.connection.remoteAddress);
												console.log("Data got updated!!");
												res.write("Successfully inserted into database");
												res.end();   // close connection

											}
										});

												

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




module.exports = sync
module.exports = router
