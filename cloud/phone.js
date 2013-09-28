
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Twilio SMS Account -- //
var Twilio = require('twilio');
Twilio.initialize(global.TWILIO_DATA().accountSid, global.TWILIO_DATA().authToken);


// -- Utilities -- //
// Finding phone numbers in strings
exports.findPhoneNumbers = function(messageStr) {
  var phoneNumbersArray = [];
  phoneNumbersArray = messageStr.match(/\+?1?[0-9]{3}[\- ]?[0-9]{3}[\- ]?[0-9]{4}/);
  return phoneNumbersArray;
}


// -- SMS Handlers -- //

exports.sendSMS = function(fromNum, toNum, bodyText) {
  console.log('Send SMS - from: ' + fromNum + ', to : ' + toNum + ', msg: ' + bodyText);
  
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
}

exports.receiveSMS = function(sms_data, response) {

  if (!sms_data.From || typeof sms_data.From == 'undefined') {
    response.error();
    throw "Received SMS - Invalid sender!";
  }
  if (!sms_data.Body || typeof sms_data.Body == 'undefined') {
    response.error();
    throw "Received SMS - Invalid body!";
  }

  try {
    var from = sms_data.From;
    var msg = sms_data.Body.toLowerCase();
  }
  catch (err) {
    response.error();
    throw "Received SMS - Error";
    }
  
  response.success();
  
  return new SMS(from, global.TWILIO_DATA().number, msg);
}


// -- SMS OBJECT -- //

/*
 * SMS Object, includes:
 * - Sender
 * - Recipient
 * - Message body
 */
function SMS(from,to,msg)
{
  this.from = from;
  this.to = to;
  this.msg = msg;
}

SMS.prototype.toString = function smsToString() {
  return "SMS - From: " + this.from + ", to: " + this.to + ", message: " + this.msg;
}