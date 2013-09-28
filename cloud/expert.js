
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Other Experts -- //
var phone_handler = require('cloud/phone.js');
var email_handler = require('cloud/email.js');

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

  // Testing Dummy //
  /*
  var sms = phone_handler.makeSMS(global.TWILIO_DATA().number, "+13128602305", "Test SMS");
  var email = email_handler.makeEMAIL("gefthefrench@gmail.com", "gefthefrench@gmail.com", "Test Email", "Test Email body");

  return [
		{
			type: "sms",
			object: sms
		},
		{
			type: "email",
			object: email
		}
	];
  */
  // Testing Dummy //

  // -- Actual Parsing -- //
  smsMsg = smsMsg.toLowerCase();

  // Sending Resumes to somone via Email
  if (smsMsg.search("@") > -1) {
    var emails = email_handler.findEmailAddresses(smsMsg);

    emails.forEach(function(email) {
      var email = email_handler.makeEMAIL("noreply@resutext.com", email, "The Resu", "Thanks brah, here's the resume!");
      actions.push( {type: "email", object: email} );
    });
  }

  // Sending Resumes to somone via SMS
  if (smsMsg.search("resume") > -1) {
    var phones = phone_handler.findPhoneNumbers(smsMsg);

    phones.forEach(function(phone) {
      var sms = phone_handler.makeSMS(global.TWILIO_DATA().number, phone, "Thanks brah, here's the resume!");
      actions.push( {type: "sms", object: sms} );
    });
  }

  // Nothing to do, must be an error
  if (actions.length < 1) {
    var sms = phone_handler.makeSMS(global.TWILIO_DATA().number, sender, "Sry man, I didn't get that...");
    actions.push( {type: "sms", object: sms} );
  } 
  // Otherwise, send a confirmation sms
  else {
    var sms = false;
    var email = false;

    actions.forEach(function(action) {
      if (action.type == "sms") sms = true;
      if (action.type == "email") email = true;
    });

    var sms;
    if (sms && email) sms = phone_handler.makeSMS(global.TWILIO_DATA().number, sender, "Email & SMS on their way!");
    else if (sms)     sms = phone_handler.makeSMS(global.TWILIO_DATA().number, sender, "SMS on its way!");
    else if (email)   sms = phone_handler.makeSMS(global.TWILIO_DATA().number, sender, "Email on its way!");

    actions.push( {type: "sms", object: sms} );
  }

  // Send it all!
  return actions;
}