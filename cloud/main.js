
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

  var actions = expert_handler.parseSMS(sms.msg, sms.from);
  if (actions) console.log("Got " + actions.length + " actions");
  
  var result = performActions(actions);
  if (result) console.log("Actions complete");
  
});


// -- Factory Expert -- //

function performActions(actions) {
  
  actions.forEach(function(action) {
    action.object.send();
  });

}