
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var user_handler = require('cloud/user_handler.js');
var expert_handler = require('cloud/expert.js');
var resume_handler = require('cloud/resume.js');



Parse.Cloud.define("sms_test", function(request, response) {
  console.log("---");
  
  var validMsgs = ['gefthefrench@gmail.com', 'resume 3128602305', 'resume 13128602305', 'resume +1-312-860-2305', 'resume +13128602305'];
  var invalidMsgs = ['@g', 'reme 3128602305', '+1-312-860-2305', 'dude'];
  
  var from = "+13128602305";
  var to = global.TWILIO_DATA().number;
  
  for (var msg in validMsgs) {
    var sms = phone_handler.makeSMS(from, to, validMsgs[msg]);
    sms.send();
  }
  for (var msg in invalidMsgs) {
    var sms = phone_handler.makeSMS(from, to, invalidMsgs[msg]);
    sms.send();
  }
  
  response.success("Launched tests");
});

Parse.Cloud.define("tiny_test", function(request, response) {
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

function getTestUser() {
  return user_handler.findUserWithPhone("3128602305");
}

Parse.Cloud.define("uploadResume_test", function(request, response) {
  
  getTestUser().then(function(user) {
  
    // Testing file
    var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
    var parseFile = new Parse.File("myfile.txt", { base64: base64 });
    
    return parseFile.save().then(function() {
        resume_handler.saveResumeObjectTest(parseFile, user).then(function() {
        response.success("Saved resume");
      },
      function(error) {
        console.log(error);
        response.error("Could not save resume");
      });
    },
    function(error) {
      console.log(error);
      response.error("Could not log in");
    });
  });
});

Parse.Cloud.define("sendResume_test", function(request, response) {

  getTestUser().then(function(user) {

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