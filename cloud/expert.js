
// -- Global Vars -- //
var global = require('cloud/globals.js');

exports.generateResponse = function(command) {
  
  return [
		{
			op: "sms",
			message: "must send sms",
			phoneNumbers: ["+13128602305"]
		},
		{
			op: "email",
			message: "must send email",
			emails: ["gefthefrench@gmail.com"]
		}
	];

  /*
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
  */
}