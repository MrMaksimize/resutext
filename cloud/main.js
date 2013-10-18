
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var user_handler = require('cloud/user_handler.js');
var expert_handler = require('cloud/expert.js');
var resume_handler = require('cloud/resume.js');


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
    
  },
  
  function(error) {
    response.error("Could not find user");
  });
  
});

Parse.Cloud.define("testTiny", function(request, response) {
  console.log("---");
  
  Parse.Cloud.httpRequest({
    url: 'http://tiny.cc/',
    params: {
      c : 'rest_api',
      m : 'shorten',
      version : '2.0.3',
      format : 'json',
      longUrl : 'http://dude.com',
      login  : 'resutext',
      apiKey : 'ecc1a578-f5b7-4aaa-beb1-d1510ed008ee'
    },
    success: function(httpResponse) {
      var tinyRes = JSON.parse(httpResponse.text);
      if (tinyRes['errorCode'] != 0) {
        console.error('Request failed with response code ' + httpResponse.status);
        response.error("Failed to get tiny");
      }
      else {
        var tinyURL = tinyRes['results']['short_url'];
        response.success("Got tiny " + tinyURL);
      }
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error("Failed to get tiny");
    }
  });
  
});


// -- Factory Expert -- //

function performActions(actions) {

  actions.forEach(function(action) {
    action.object.send();
  });

}
