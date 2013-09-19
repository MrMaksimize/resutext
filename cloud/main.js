
var Twilio = require('twilio');
var accountSid = 'AC439fd476eb3ee822125daca41811ed03';
var authToken = 'e45c87328232b821063880b62b023a0e';

Twilio.initialize(accountSid, authToken);

var generateResponse = function(command) {
  var originalCommand = command;
  command = command.toLowerCase();
  if (command.indexOf("resume") != -1) {
    return "Maksim is Awesome.  Check out his resume here: http://bit.ly/MaksimRes";
  }
  // Fallback
  else {
    var response = "Ok... I'll be honest here.  I dont know what '" + originalCommand + "' Means.";
    var insult = "Please learn to use your keyboard.  Thanks!";

    response = response + " " + insult;
    return response;
  }
}

var sendSMS = function(fromNum, toNum, bodyText) {
  console.log('from: ' + fromNum);
  console.log('to : ' + toNum);
  console.log('text: ' + bodyText);
  Twilio.sendSMS({
    From: fromNum,
    To: toNum,
    Body: bodyText,
  }, {
    success: function(httpResponse) {
      console.log(httpResponse);
      console.log('request success');
    },
    error: function(httpResponse) {
       console.error(httpResponse);
       throw "Request went awry";
    }
  });
}


Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log('log');
  console.log(request.params);
  // Get Command
  var command = request.params.Body;
  var responseMessageText = generateResponse(command);
  try {
    sendSMS(request.params.To, request.params.From, responseMessageText);
    response.success("Response Complete");
  } catch (error) {
    response.error(error.message);
  }
});


