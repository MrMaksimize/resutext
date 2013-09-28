
// -- Twilio SMS Account -- //
var Twilio = require('twilio');
var accountSid = 'AC5a2be84ac3f138f11d48e040c7de698a';
var authToken = '7d71bcb8e36444fae06cdc335a16d74a';

Twilio.initialize(accountSid, authToken);

exports.sendSMS = function(fromNum, toNum, bodyText) {
  //console.log('from: ' + fromNum);
  //console.log('to : ' + toNum);
  //console.log('text: ' + bodyText);
  Twilio.sendSMS({
    From: fromNum,
    To: toNum,
    Body: bodyText,
  }, {
    success: function(httpResponse) {
      console.log('SMS Success');
    },
    error: function(httpResponse) {
       console.error(httpResponse);
       throw "SMS Failed";
    }
  });
  return;
}

exports.findPhoneNumbers = function(messageStr) {
  var phoneNumbersArray = [];
  phoneNumbersArray = messageStr.match(/\+?1?[0-9]{3}[\- ]?[0-9]{3}[\- ]?[0-9]{4}/);
  return phoneNumbersArray;
}