var url = "mongodb://sai:sai@ds151927.mlab.com:51927/mobiledatausage"
exports.db1 = function(){
	//first connection to mobiledata database 
	var dburl1 = url ;

	return require('mongojs').connect(dburl1);
	
}