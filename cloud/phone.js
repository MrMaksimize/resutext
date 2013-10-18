
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Twilio SMS Account -- //
var Twilio = require('twilio');
Twilio.initialize(global.TWILIO_DATA().accountSid, global.TWILIO_DATA().authToken);

function InvalidPhoneException() {}

// -- Utilities -- //
// Finding phone numbers in strings
exports.findPhoneNumbers = function(messageStr) {
  var phoneNumbersArray = [];
  if (messageStr.length < 10) return phoneNumbersArray;
  
  phoneNumbersArray = messageStr.match(/\+?1?[0-9]{3}[\- ]?[0-9]{3}[\- ]?[0-9]{4}/);
  return phoneNumbersArray;
}

exports.filterPhone = function(phone) {
  var filteredPhone = phone.replace("-","");
  var filteredPhone = phone.replace("+","");

  if (filteredPhone[0] == 1) filteredPhone.substring(1,filteredPhone.length);
  if (filteredPhone.length != 10) throw InvalidPhoneException("Less than 10 digits");
  
  return filteredPhone;
}


// -- SMS Handler -- //

exports.receiveSMS = function(sender, message, response) {

  if (sender == null) {
    response.error();
    return;
  }
  if (message == null) {
    response.error();
    return;
  }
  
  var from = sender;
  var to = global.TWILIO_DATA().number;
  var msg = message;
  
  response.success();
  
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
      response.success('SMS Sent');
    },
    error: function(httpResponse) {
      console.log('SMS Failed');
      response.error('SMS Failed');
    }
  });
}

SMS.prototype.get = function smsGet() {
  return { from: this.from, to: this.to, msg: this.msg };
}

SMS.prototype.toString = function smsToString() {
  return "SMS - From: " + this.from + ", to: " + this.to + ", message: " + this.msg;
}