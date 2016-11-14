//var url = 'mongodb://mongodb-1.recharge-plan-reco.4447.mongodbdns.com:27000,mongodb-0.recharge-plan-reco.4447.mongodbdns.com:27000,mongodb-2.recharge-plan-reco.4447.mongodbdns.com:27000/'


// var url = "localhost:27017/"
var url = "mongodb://sai:sai@ds151927.mlab.com:51927/mobiledatausage"
exports.db1 = function(){
	//first connection to mobiledata database 
	var dburl1 = url + "mobiledata" ;

	return require('mongojs').connect(dburl1);
	
}

/*
//second connection to Circle database here it is Karnataka
exports.db2 = function(circle){
	var dburl2 = url + circle ;
	return require('mongojs').connect(dburl2);
}
*/
