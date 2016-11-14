
var express = require('express')
, router = express.Router()
, sync_data = router.route('/')
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

sync_data.post(function(req,res){

	// decrypting the message received	
	try {
		console.log("req handler 'sync_data' was called.");

		//console.log(req.body);
		//console.log("data received");
		var received = req.body;
		//console.log(received);		
		//console.log(req);			
		//var received = security.decipher(received);
		//console.log("After decryption");
		//console.log(received);
		received = JSON.parse(received);
		//parsing the decrypted message
		console.log(received);

		//throw "failed to decrypt";



		//specifying collection for querying
		var coll = "logs";
		var getlogs = db1.collection(coll);
		//var getlogs = req.db.collection(coll);		
		//res.send("succesfull");
		/*getlogs.find({},function(err,docs){
			if(err){console.log(err);}
			console.log("database response")					
		})
		 */
		getlogs.find({"IMEI" : received.IMEI},function(err,docs){
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
					console.log(received.data);
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

							if(doc.data.length != 0 ){
								//increment the id to current length of the document
								getlogs.update({"IMEI": received.IMEI },{ $inc: { id : doc.data.length-1 } },function(err){
									if(err){
										console.log(err);
									}
									else{
										console.log("hello2");
										var temp = received.id+doc.data.length-1;
										temp+= '';
										console.log("sending current database id");
										console.log(temp);
										res.write(temp); //send current count
										console.log("successfully synced data " + req.connection.remoteAddress);
										res.end();   // close connection

									}										
								}); // end update 
							}   //end if 
						}	 //end else
					}); // end insert query
				}// end if condition
				else{
					// get current id 
					console.log("in else");
					getlogs.aggregate([{$match : {"IMEI" : received.IMEI}},{$project : { "_id":0, "id" : 1 } }],function(err,docid){
						if(err){
							console.log(err);
						}
						else{
							//compare database id with received id
							// if received_id < current_id means res message to client is lost and it is not updated in their client
							console.log("matching is done!!")
							console.log(docid)
							if(received.id < docid[0].id){
								var temp = docid[0].id;
								temp+= '';
								console.log("need to update client database");
								console.log(temp);
								res.write(temp);
								res.end();
							}
							else if (received.id-1 == docid[0].id){
								for ( var i = 0; i< received.data.length;i++) {
									serverDate = new Date();
									//offset = date.getTimezoneOffset() * 60000;
									//date = new Date(date.valueOf() - offset);
									received.data[i].date = new Date(received.data[i].date);
									received.data[i].server_synctime = serverDate;
									//received[i].server_synctime = date.toISOString();
									received.data[i].ip = req.connection.remoteAddress;
								}
								//both are in synchronize and need to update database
								getlogs.update({"IMEI" : received.IMEI},{$push : { data:{$each: received.data }}},function(err){
									if(err){
										console.log(err);
										console.log("error in writing to database");
										var temp = docid[0].id;
										temp+= '';
										res.write(temp);
										res.end();
									}
									else{
										getlogs.update({"IMEI": received.IMEI },{ $inc: { id: received.data.length} },function(err,docs){
											if(err){
												console.log(err);
												//res.write(docid[0].id);
												//res.end();
											}
											else{
												console.log("hello3");
												console.log("current database id")
												console.log(docid[0].id + received.data.length);
												console.log("successfully synced data " + req.connection.remoteAddress);
												var temp = docid[0].id + received.data.length;
												temp+= '';
												console.log("sending current database id");
												console.log(temp);
												res.write(temp); //send current count
												res.end();   // close connection

											}

										}); //end update
									}
								});

							}
						}
					});

				}
			} //end first else

		}); // end getlogs find 
	}
	catch (e) {
		console.log("failed to decrypt from " + req.connection.remoteAddress);
		res.write("DE"); // decrypt error
		res.end();
		console.log(e);

	}// catch else			




}); //end sync data




module.exports = sync_data
module.exports = router
