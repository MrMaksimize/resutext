
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


// -- SMS Handler -- //

exports.receiveSMS = function(sms_data, response) {

  var from = "";
  var to = global.TWILIO_DATA().number;
  var msg = "";

  // Getting the sender number
  if (sms_data.From && typeof sms_data.From != 'undefined') 
    from = sms_data.From;

  // Getting the sms body
  if (sms_data.Body && typeof sms_data.Body != 'undefined') 
    msg = sms_data.Body;
  
  if (from.length > 0 && msg.length > 0) 
       response.success();
  else response.error();
  
  return new SMS(from, to, msg);
}


// -- Public SMS Constructor -- //

exports.makeSMS = function(from, to, msg) {
  return new SMS(from,to,msg);
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

SMS.prototype.send = function smsSend() {
  console.log("Sending " + this);
  
  Twilio.sendSMS({
    From: this.from,
    To: this.to,
    Body: this.msg,
  }, {
    success: function(httpResponse) {
      console.log('SMS Sent');
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      console.log('SMS Failed');
      throw "SMS Failed";
    }
  });
}

SMS.prototype.get = function smsGet() {
  return { from: this.from, to: this.to, msg: this.msg };
}

SMS.prototype.toString = function smsToString() {
  return "SMS - From: " + this.from + ", to: " + this.to + ", message: " + this.msg;
}