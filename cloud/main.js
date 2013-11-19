
// -- Global Vars -- //
var global = require('cloud/globals.js');
require('cloud/testing.js');
require('cloud/app.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var user_handler = require('cloud/user_handler.js');
var expert_handler = require('cloud/expert.js');
//var resume_handler = require('cloud/resume.js');


// Mocha test

var message = require('cloud/message.js');

Parse.Cloud.define("get_message", function(request, response) {
  message.getMessage(request, response);
});

// -- Receiving SMSes -- //

Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log("---");

  if (request.params.From && typeof request.params.From != 'undefined') {

    request.params.From = phone_handler.filterPhone(request.params.From);

    var findUser = user_handler.findUserWithPhone(request.params.From);
    findUser.then(function(user) {

      if (!user || user == null || user.length < 1) {
        response.error("Could not find user");
        return;
      }

      var sms = phone_handler.receiveSMS(request.params.From, request.params.Body, response);
      if (sms) console.log("Received: " + sms);
      else console.log("Received: " + "Invalid SMS");

      var actions = expert_handler.parseSMS(sms.msg, sms.from);
      if (actions) console.log("Got " + actions.length + " action(s)");
      else console.log("Got: " + "Invalid Actions");

      var result = performActions(actions);
      response.success("Successfully handled user sms");

    }, function(error) {
      response.error("Could not find user");
    });
  }
  else {
    console.log("Some problem occured");
    response.error("SMS received in a weird way, phone was invalid");
  }
});



/*Parse.Cloud.define("sendResume", function(request, response) {
  console.log("---");

  var currentUser = Parse.User.current();
  if (!currentUser) {
    response.error("User currently not logged in");
  }

  resume_handler.retrieveResumeForUser(user).then(function(resume) {
    console.log(resume);
    response.success("Got resume!");
  },
  function(error) {
    response.error("Could not get the resume");
  });
});*/


// -- Factory Expert -- //

function performActions(actions) {

  actions.forEach(function(action) {
    action.object.send();
  });

}
