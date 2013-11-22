
// -- Global Vars -- //
var global = require('cloud/globals.js');
require('cloud/testing.js');
require('cloud/app.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var user_handler = require('cloud/user_handler.js');
var expert_handler = require('cloud/expert.js');
//var resume_handler = require('cloud/resume.js');

var User = require('cloud/models/resutextUser');


// Mocha test


Parse.Cloud.define("get_message", function(request, response) {
  message.getMessage(request, response);
});

// -- Receiving SMSes -- //

Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log("---");

  if (request.params.From && typeof request.params.From != 'undefined') {

    request.params.From = phone_handler.filterPhone(request.params.From);

    console.log(request.params);
    User.getByAttribute('phone', request.params.From).then(function(user) {
      var sms = phone_handler.receiveSMS(request.params.From, request.params.Body, response);
      if (sms) console.log("Received: " + sms);
      else console.log("Received: " + "Invalid SMS");

      var actions = expert_handler.parseSMS(sms.msg, sms.from);
      if (actions) console.log("Got " + actions.length + " action(s)");
      else console.log("Got: " + "Invalid Actions");

      var result = performActions(actions);
      console.log('response');
      response.success("Successfully handled user sms");
    },
    function(error){
      console.log('response');
      response.error("CANNOT FIND USER");
    });

  }
  else {
      console.log('response');
    console.log("Some problem occured");
    response.error("SMS received in a weird way, phone was invalid");
  }
});




// -- Factory Expert -- //

function performActions(actions) {

  actions.forEach(function(action) {
    console.log(action);
    action.object.send();
  });

}
