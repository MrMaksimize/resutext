
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var expert_handler = require('cloud/expert.js');
var resume_handler = require('cloud/resume.js');


// -- Receiving SMSes -- //

Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log("---");

  var sms = phone_handler.receiveSMS(request.params, response);
  if (sms) console.log("Received: " + sms);
  else console.log("Received: " + "Invalid SMS");

  var actions = expert_handler.parseSMS(sms.msg, sms.from);
  if (actions) console.log("Got " + actions.length + " action(s)");
  else console.log("Got: " + "Invalid Actions");

  var result = performActions(actions);

});


// -- Resume Business -- //

Parse.Cloud.define("uploadResume", function(request, response) {
  console.log("---");

  var user = Parse.User.current();
  if (!user) {
    response.error("User currently not logged in");
  }
    
  resume_handler.uploadResumeForUser(user).then(function() {
    response.success("Saved resume");
  },
  function() {
    response.error("Could not save resume");
  });
});


// -- Factory Expert -- //

function performActions(actions) {

  actions.forEach(function(action) {
    action.object.send();
  });

}
