
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var email_handler = require('cloud/email.js');


// -- Receiving SMSes -- //

Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log("-\n");
  
  try {
    var sms = phone_handler.receiveSMS(request.params, response);
    console.log("sms: " + sms);
  }
  catch (err) {
    console.log("Error: " + err.message);
    console.log("Bad SMS");
  }
  /*
  console.log(request.params);

  var sender = request.params.From;
  var command = request.params.Body.toLowerCase();
  var responses = generateResponse(command);

  for (var i in responses) {

  	// Sending an sms to new numbers
    if (responses[i].op == 'sms' && responses[i].phoneNumbers) {
      for (var p in responses[i].phoneNumbers) {
        try {
        	phone_handler.sendSMS(sender, phoneNumbers[p], responses[i].message);
        } catch (error) {
          response.error(error.message);
        }
      }
    }

    // Responding back to the user via sms
    else if (responses[i].op == 'sms') {
		try {
			phone_handler.sendSMS(TWILIO_NUMBER, sender, responses[i].message);
		} catch (error) {
		  response.error(error.message);
		}
    }

    // Sending emails
    else if (responses[i].op == 'email') {
      if (responses[i].emails.length != 0) {
        var toArray = [];
        for (var email in responses[i].emails) {
          toArray.push({email: responses[i].emails[email]});
        }
        console.log(toArray);
        try {
          email_handler.sendEmail({
            subject: "Maksim's Resume! Thanks!",
            text: responses[i].message,
            to: toArray,
          });
        } catch (error) {
          response.error(error.message);
        }
      }
    }
  }
  */
});


// -- Response Generator -- //

var generateResponse = function(command) {
  var originalCommand = command.toLowerCase();

  if (command.search("@") > -1 && command.search("resume") > -1) {
    var textMessage = "Check out Maksim's resume " + resumeURLScribd + " and his site - " + mrmSite;
    var emails = email_handler.findEmailAddresses(command);
    console.log(emails);
    var emailStatusMessage = " I'll also send you an email!";

    if (!emails || emails.length < 1) emailStatusMessage = INVALID_EMAIL_MSG;

    var phoneNumbers = phone_handler.findPhoneNumbers(command);
    return [{
      op: "sms",
      message: textMessage + emailStatusMessage,
      phoneNumbers: phoneNumbers
    },
    {
      op: "email",
      message: EMAIL_RESUME,
      emails: emails
    }]
  }

  else if (command.indexOf("resume") != -1) {
    var phoneNumbers = phone_handler.findPhoneNumbers(command);
    return [{
      op: "sms",
      message: "Maksim is Awesome.  Check out his resume here: " + resumeURLScribd + " and his personal site here - " + mrmSite,
      phoneNumbers: phoneNumbers
    }];
  }

  else if (command.search("@") > -1) {
  	var emails = email_handler.findEmailAddresses(command);
  	var textMessage = "Resume has been sent to: " + emails;

	if (!emails || emails.length < 1) textMessage = INVALID_EMAIL_MSG;

	return [
		{
			op: "sms",
			message: textMessage,
			phoneNumbers: null
		},
		{
			op: "email",
			message: EMAIL_RESUME,
			emails: emails
		}
	];
  }

  // Fallback
  else {
    var phoneNumbers = phone_handler.findPhoneNumbers(command);
    return [{
      op: "sms",
      message: INVALID_REQUEST_MSG,
      phoneNumbers: phoneNumbers
    }];
  }
}