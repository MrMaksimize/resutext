
// -- Global Vars -- //

var INVALID_REQUEST_MSG = "Ok... I'll be honest here, I dont know what that means ):"
var INVALID_EMAIL_MSG = "Email doesn't look too good, maybe you should try it again."
var INVALID_PHONE_MSG = "Phone number doesn't look too good, maybe you should try it again."

var sms_handler = require('cloud/sms.js');
var email_handler = require('cloud/email.js');


// -- Receiving SMSes -- //

Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log('log');
  console.log(request.params);
  // Get Command
  var command = request.params.Body;
  var responses = generateResponse(command);
  console.log(responses);
  for (var i in responses) {
    console.log(responses[i]);
    // TODO - figure our recursion with response
    if (responses[i].op == 'sms') {
      phoneNumbers = responses[i].phoneNumbers.length > 0 ? responses[i].phoneNumbers.length : new Array(request.params.From);
      for (var p in phoneNumbers) {

        try {
        	sms_handler.sendSMS(request.params.To, phoneNumbers[p], responses[i].message);
        } catch (error) {
          response.error(error.message);
        }
      }
    }
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
});


// -- Response Generator -- //

var generateResponse = function(command) {
  var originalCommand = command;
  var resumeURL = "http://bit.ly/MaksimRes";
  var resumeURLScribd = "http://bit.ly/MaksimRes1";
  var mrmSite = "http://MrMaksimize.com";
  command = command.toLowerCase();
  if (command.indexOf("@") !== -1 && command.indexOf("resume") !== -1) {
    var textMessage = "Check out Maksim's resume " + resumeURLScribd + " and his site - " + mrmSite + " then call him at 1.773.677.7755;";
    var emailMessage = "Hey there! Looks like you wanted to see Maksim's Resume.  And here it is!  Enjoy the read! " + resumeURL + "\n Don't forget to check out his personal site as well - " + mrmSite + "\n Make sure you give him a call at 1.773.677.7755 or email him - maksim@maksimize.com";
    var emails = email_handler.findEmailAddresses(command);
    console.log(emails);
    var emailStatusMessage = " I'll also send you an email!";
    if (emails.length == 0) {
      emailStatusMessage = " However, I couldn't figure out your email.  Usually an email has an @ in it.";
    }
    return [{
      op: "sms",
      message: textMessage + emailStatusMessage,
    },
    {
      op: "email",
      message: emailMessage,
      emails: emails
    }]
  }

  else if (command.indexOf("resume") != -1) {
    return [{
      op: "sms",
      message: "Maksim is Awesome.  Check out his resume here: " + resumeURLScribd + " and his personal site here - " + mrmSite,
    }];
  }

  else if (command.indexOf("send to") != -1) {

    var textMessage = "Check out Maksim's resume " + resumeURLScribd + " and his site - " + mrmSite + " then call him at 1.773.677.7755;";
    var phoneNumbers = sms_handler.findPhoneNumbers(command);
    if (phoneNumbers.length > 0) {
      return [{
        op: "sms",
        message: textMessage,
        phoneNumbers: phoneNumbers
      }];
    }
  }
  // Fallback
  else {
    var response = "Ok... I'll be honest here.  I dont know what '" + originalCommand + "' Means.";
    var insult = "Please learn to use your keyboard.  Thanks!";

    response = response + " " + insult;
    return [{
      op: "sms",
      message: response
    }];
  }
}
