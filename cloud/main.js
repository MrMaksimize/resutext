
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var expert_handler = require('cloud/expert.js');
var resume_handler = require('cloud/resume.js');


// -- Receiving SMSes -- //

Parse.Cloud.define("incomingSMS", function(request, response) {
  console.log("---");

  if (request.params.From && typeof request.params.From != 'undefined') {
    
    var findUser = user_handler.findUserWithPhone(request.params.From);
    
    findUser.then(function(user) {
      
      if (!user || user == null || user.length < 1) {
        response.error("Could not find user");
        return;
      }
  
      var sms = phone_handler.receiveSMS(request.params, response);
      if (sms) console.log("Received: " + sms);
      else console.log("Received: " + "Invalid SMS");
    
      var actions = expert_handler.parseSMS(sms.msg, sms.from);
      if (actions) console.log("Got " + actions.length + " action(s)");
      else console.log("Got: " + "Invalid Actions");
    
      var result = performActions(actions);
      
    }, function(error) {
      response.error("Could not find user");
    });
  }
  else {
    response.error("SMS received in a weird way, phone was invalid");
  }
});


// -- Resume Business -- //

Parse.Cloud.define("uploadResume", function(request, response) {
  console.log("---");

<<<<<<< HEAD
  var user = Parse.User.current();
  if (!user) {
    response.error("User currently not logged in");
  }
=======
  var findUser = user_handler.findUserWithPhone("3128602305");

  findUser.then(function(user) {
    
    resume_handler.uploadResumeForUser(user).then(function() {
      response.success("Saved resume");
    },
    function() {
      response.error("Could not save resume");
    });
  }, function(error) {
    response.error("Could not log in");
  });

  /*
  var currentUser = Parse.User.current();
  if (!currentUser) {
    response.error("User currently not logged in");
  }
  resume_handler.uploadResume(currentUser);
  */
});

Parse.Cloud.define("sendResume", function(request, response) {
  console.log("---");
  
  var findUser = user_handler.findUserWithPhone("3128602305");

  findUser.then(function(user) {

    resume_handler.retrieveResumeForUser(user).then(function(resume) {
      console.log(resume);
      response.success("Got resume!");
    },
    function(error) {
      response.error("Could not get the resume");
    });
>>>>>>> resume_retrieve_dev
    
  resume_handler.uploadResumeForUser(user).then(function() {
    response.success("Saved resume");
  },
  function() {
    response.error("Could not save resume");
  });
<<<<<<< HEAD
=======
  
>>>>>>> resume_retrieve_dev
});


// -- Factory Expert -- //

function performActions(actions) {

  actions.forEach(function(action) {
    action.object.send();
  });

}
