
var Twilio = require('twilio');
var accountSid = 'AC439fd476eb3ee822125daca41811ed03';
var authToken = 'e45c87328232b821063880b62b023a0e';

Twilio.initialize(accountSid, authToken);

var Mandrill = require('mandrill');
Mandrill.initialize('MwUpljIiBM9LpoFfk3YQrw');

function findEmailAddresses(StrObj) {
  var separateEmailsBy = ", ";
  var emailsArray = [];
  emailsArray = StrObj.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  return emailsArray;
}

var generateResponse = function(command) {
  var originalCommand = command;
  var resumeURL = "http://bit.ly/MaksimRes";
  var resumeURLScribd = "http://bit.ly/MaksimRes1";
  var mrmSite = "http://MrMaksimize.com";
  command = command.toLowerCase();
  if (command.indexOf("@") !== -1 && command.indexOf("resume") !== -1) {
    var textMessage = "Check out Maksim's resume " + resumeURLScribd + " and his site - " + mrmSite;
    var emailMessage = "Hey there! Looks like you wanted to see Maksim's Resume.  And here it is!  Enjoy the read! " + resumeURL + ". Don't forget to check out his personal site as well - " + mrmSite;
    var emails = findEmailAddresses(command);
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

var sendSMS = function(fromNum, toNum, bodyText) {
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

var sendEmail = function(message) {
  console.log("Sending Message");
  console.log(message);
  Mandrill.sendEmail({
    message: {
      text: message.text,
      subject: message.subject,
      from_email: "no-reply@resutext.com",
      from_name: "ResuText",
      to: message.to//[
        //{email: "you@parse.com", name: "Your Name"}
      //]
    },
    async: true
  },{
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });
}

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
      try {
        sendSMS(request.params.To, request.params.From, responses[i].message);
      } catch (error) {
        response.error(error.message);
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
          sendEmail({
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


