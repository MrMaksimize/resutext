
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var user_handler = require('cloud/user_handler.js');
var expert_handler = require('cloud/expert.js');
var resume_handler = require('cloud/resume.js');
var email_handler = require('cloud/email.js');


/**
 * Special testing via SMS for correct behavior
 */
Parse.Cloud.define("sms_test", function(request, response) {
  console.log("---");
  
  validMsgs = request.params.validMsgs;
  invalidMsgs = request.params.invalidMsgs;
  from = request.params.from;
  
  from = typeof from !== 'undefined' ? from : "+13128602305";
  var to = global.TWILIO_DATA().number;
  
  for (var msg in validMsgs) {
    var sms = phone_handler.makeSMS(from, to, validMsgs[msg]);
    //console.log(sms);
    sms.send();
  }
  for (var msg in invalidMsgs) {
    var sms = phone_handler.makeSMS(from, to, invalidMsgs[msg]);
    //console.log(sms);
    sms.send();
  }
  
  response.success("Launched tests");
});


/**
 * Code testing
 */
function getTestUser() {
  return user_handler.findUserWithPhone("3128602305");
}

// Functionality testing
Parse.Cloud.define("tiny_test", function(request, response) {
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
        response.error("Invalid tiny");
      }
      else {
        var tinyURL = tinyRes['results']['short_url'];
        response.success("Got tiny");
      }
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      response.error("Tiny failed");
    }
  });
});

Parse.Cloud.define("findUserWithPhone_test", function(request, response) {
  if (!request.params.hasOwnProperty('Phone')) {
    response.error("No Phone provided");
    return;
  }
  user_handler.findUserWithPhone(request.params.Phone).then(function(user) {
    
    if (user == null) {
      response.error("Invalid user");
    }
    else if (user.length < 1) {
      response.error("Invalid user");
    }
    else {
      response.success("Valid user");
    }
  },
  function(error) {
    console.log(error);
    response.error("No user");
  });
});

Parse.Cloud.define("findUserWithEmail_test", function(request, response) {
  if (!request.params.hasOwnProperty('Email')) {
    response.error("No Email provided");
    return;
  }
  user_handler.findUserWithEmail(request.params.Email).then(function(user) {
    
    if (user == null) {
      response.error("Invalid user");
    }
    else if (user.length < 1) {
      response.error("Invalid user");
    }
    else {
      response.success("Valid user");
    }
  },
  function(error) {
    console.log(error);
    response.error("No user");
  });
});

Parse.Cloud.define("findPhoneNumbers_test", function(request, response) {
  if (!request.params.hasOwnProperty('Phone')) {
    response.error("No Phone provided");
    return;
  }
  
  var phones = phone_handler.findPhoneNumbers(request.params.Phone);
  if (phones == null || phones.length < 1) {
    response.error("No Valid Phone");
    return;
  }
  response.success(request.params.Phone);
});

Parse.Cloud.define("filterPhone_test", function(request, response) {
  if (!request.params.hasOwnProperty('Phone')) {
    response.error("No Phone provided");
    return;
  }
  
  try {
    var phone = phone_handler.filterPhone(request.params.Phone);
    if (phone == null) {
      response.error("No Valid Phone");
      return;
    }
    response.success(request.params.Phone);
    return;
  } catch (err) {
    console.log(err);
    response.error("No Valid Phone");
  }
});

Parse.Cloud.define("findEmailAddresses_test", function(request, response) {
  if (!request.params.hasOwnProperty('Email')) {
    response.error("No Email provided");
    return;
  }
  
  var emails = email_handler.findEmailAddresses(request.params.Email);
  if (emails == null || emails.length < 1) {
    response.error("No Valid Email");
    return;
  }
  response.success(request.params.Email);
  return;
});


// Feature testing
Parse.Cloud.define("uploadResume_test", function(request, response) {  
  getTestUser().then(function(user) {
  
    // Testing file
    var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
    var parseFile = new Parse.File("myfile.txt", { base64: base64 });
    
    return parseFile.save().then(function() {
        resume_handler.saveResumeObjectTest(parseFile, user).then(function() {
        response.success("Resume saved");
      },
      function(error) {
        console.log(error);
        response.error("Could not save resume");
      });
    },
    function(error) {
      console.log(error);
      response.error("Could not save file");
    });
  });
});

Parse.Cloud.define("retrieveResume_test", function(request, response) {
  getTestUser().then(function(user) {

    resume_handler.retrieveResumeForUser(user).then(function(resume) {
      console.log(resume);
      if (resume == null )
           response.error("Invalid resume");
      else response.success("Valid resume");
    },
    function(error) {
      console.log(error);
      response.error("No resume");
    });
    
  },
  function(error) {
    console.log(error);
    response.error("No user");
  });
});

Parse.Cloud.define("incomingSMS_test", function(request, response) {
  if (!request.hasOwnProperty('From')) {
    response.error("No Phone provided");
    return;
  }
  if (!request.hasOwnProperty('From')) {
    response.error("No Body provided");
    return;
  }
  
  return Parse.Cloud.run('incomingSMS', request.params);

});