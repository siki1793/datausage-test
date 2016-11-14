
var security = require("./encryption.js");
var body = {"operator" : "Tata Docomo GSM","number" : "8904765965", "data" : [{ "timestamp" : "30/10/2015" , "2G" : "15","3G" : 10,"4G" : "3", "wifi" : "20"}]}
var encrypted = security.cipher(body);
console.log("After encryption");
console.log(encrypted);
console.log("After decryption");
var decrypted = security.decipher(encrypted);
decrypted = JSON.parse(decrypted);
console.log(decrypted.operator);
