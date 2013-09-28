
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var email_handler = require('cloud/email.js');
var expert_handler = require('cloud/expert.js');


// -- Receiving SMSes -- //

Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log("---");

  var sms = phone_handler.receiveSMS(request.params, response);
  if (sms) console.log("Received: " + sms);

  var actions = expert_handler.parseSMS(sms.msg);
  if (actions) console.log("Got " + actions.length + " actions");
  
  var result = performActions(actions);
  if (result) console.log("Actions complete");
  
});

// -- Factory Expert -- //

function performActions(actions) {
  
  actions.forEach(function(action) {
    //console.log("Action: " + action.object);
    action.object.send();
  });
  /*
  for (var i in responses) {

  	// Sending an sms to new numbers
    if (responses[i].op == 'sms' && responses[i].phoneNumbers) {
      for (var p in responses[i].phoneNumbers) {
        try {
        	phone_handler.sendSMS(sms.from, phoneNumbers[p], responses[i].message);
        } catch (error) {
          response.error(error.message);
        }
      }
    }

    // Responding back to the user via sms
    else if (responses[i].op == 'sms') {
		try {
			phone_handler.sendSMS(global.TWILIO_DATA().number, sms.to, responses[i].message);
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
}