
// -- Twilio SMS Account -- //
var Twilio = require('twilio');
var accountSid = 'AC439fd476eb3ee822125daca41811ed03';
var authToken = 'e45c87328232b821063880b62b023a0e';

Twilio.initialize(accountSid, authToken);

exports.sendSMS = function(fromNum, toNum, bodyText) {
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

exports.findPhoneNumbers = function(messageStr) {
  var phoneNumbersArray = [];
  phoneNumbersArray = messageStr.match(/\+?1?[0-9]{3}[\- ]?[0-9]{3}[\- ]?[0-9]{4}/);
  return phoneNumbersArray;
}