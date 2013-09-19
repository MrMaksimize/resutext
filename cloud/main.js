
var Twilio = require('twilio');

Twilio.initialize(accountSid, authToken);

Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log(request);
});
