
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var user_handler = require('cloud/user_handler.js');
var expert_handler = require('cloud/expert.js');


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


// -- Receiving User Registration -- //

Parse.Cloud.define("newUser", function(request, response) {
  console.log("---");

  var user = user_handler.makeAUser("gefthefrench@gmail.com", "Jeff", "French", "3128602305", "https://dl.dropboxusercontent.com/u/30415492/Resume_Geoffroy.pdf");

  if (!user)  response.error();
  else        response.success();

  if (user) user.register();

});


// -- Factory Expert -- //

function performActions(actions) {

  actions.forEach(function(action) {
    action.object.send();
  });

}
