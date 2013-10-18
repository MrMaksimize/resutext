
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');


Parse.Cloud.define("testAll", function(request, response) {
  console.log("---");
  
  
  var validMsgs = ['gefthefrench@gmail.com', 'resume 3128602305', 'resume 13128602305', 'resume +1-312-860-2305', 'resume +13128602305'];
  var invalidMsgs = ['@g', 'reme 3128602305', '+1-312-860-2305', 'dude'];
  
  var from = "+13128602305";
  var to = global.TWILIO_DATA().number;
  
  for (var msg in validMsgs) {
    var sms = phone_handler.makeSMS(from, to, validMsgs[msg]);
    sms.send();
  }
  for (var msg in invalidMsgs) {
    var sms = phone_handler.makeSMS(from, to, invalidMsgs[msg]);
    sms.send();
  }
  
  response.success("Launched tests");
});