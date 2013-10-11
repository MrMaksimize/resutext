
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Other Experts -- //
var phone_handler = require('cloud/phone.js');
var email_handler = require('cloud/email.js');
var resume_handler = require('cloud/resume.js');
var user_handler = require('cloud/user_handler.js');

/*
 * Parsing the SMS body
 * and returning actions
 * corresponding to the
 * user input.
 *
 * Output array has objects:
 * {
 *   type : sms|email,
 *   object: sms_obj|email_obj
 * }
 */
exports.parseSMS = function(smsMsg, sender) {
  
  var actions = new Array();

  // -- Actual Parsing -- //
  smsMsg = smsMsg.toLowerCase();
  
  var from = global.TWILIO_DATA().number;

  // Sending Resumes to someone via Email
  if (smsMsg.search("@") > -1) {
    var emails = email_handler.findEmailAddresses(smsMsg);

    if (emails && emails.length > 0) {
      emails.forEach(function(email) {
        var email = email_handler.makeEMAIL("noreply@resutext.com", email, "The Resu", "Thanks brah, here's the resume!");
        actions.push( {type: "email", object: email} );
      });
    }
  }

  // Sending Resumes to somone via SMS
  if (smsMsg.search("resume") > -1) {
    var phones = phone_handler.findPhoneNumbers(smsMsg);

    if (phones && phones.length > 0) {
      phones.forEach(function(phone) {
        var sms = phone_handler.makeSMS(from, phone, "Thanks brah, here's the resume!");
        actions.push( {type: "sms", object: sms} );
      });
    }
  }

  // Nothing to do, must be an error
  if (actions.length < 1) {
    var sms = phone_handler.makeSMS(from, sender, "Sry man, I didn't get that ):");
    actions.push( {type: "sms", object: sms} );
  } 
  // Otherwise, send a confirmation sms
  else {
    var sendSMS = false;
    var sendEMAIL = false;

    actions.forEach(function(action) {
      if (action.type == "sms") sendSMS = true;
      if (action.type == "email") sendEMAIL = true;
    });

    var sms;
    if (sendSMS && sendEMAIL) sms = phone_handler.makeSMS(from, sender, "Email & SMS on their way!");
    else if (sendSMS)         sms = phone_handler.makeSMS(from, sender, "SMS on its way!");
    else if (sendEMAIL)       sms = phone_handler.makeSMS(from, sender, "Email on its way!");

    actions.push( {type: "sms", object: sms} );
  }

  // Send it all!
  return actions;
}