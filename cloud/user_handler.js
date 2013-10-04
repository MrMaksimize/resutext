
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var email_handler = require('cloud/email.js');

function checkResumeURL(StrObj) {
  var resumeArray = [];
  resumeArray = StrObj.match("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return resumeArray;
}


// -- User lookup -- //

exports.findUserWithPhone = function(phone) {

  if (!phone || phone.length < 10)                return null;
  if (phone_handler.findPhoneNumbers(phone) < 1)  return null;

  // -- Test authentication -- //

  var currentUser = Parse.User.current();
  if (currentUser) {
    console.log("Current: " + currentUser.username);
  } else {
      console.log("No current User");
  }

  var user = Parse.User.logIn("gefthefrench@gmail.com", "resutext", {
    success: function(user) {
      console.log("Logged in");
    },
    error: function(user, error) {
      console.log("Error logging in");
    }
  });

  var currentUser = Parse.User.current();
  if (currentUser) {
    console.log("Current: " + currentUser.username);
  } else {
      console.log("No current User");
  }
  // -- End test -- //

  /*
  var query = new Parse.Query(Parse.User);
  query.equalTo("phone", phone);
  query.find({
    success: function(results) {
      console.log("Result: " + results);
      //console.log("Successfully found " + results.length + " users.");
      // Do something with the returned Parse.Object values
      /*
      for (var i = 0; i < results.length; i++) { 
        var object = results[i];
        console.log(object.id + ' - ' + object.get('phone'));
      }
      */
      /*
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
*/

  return "ha!";
}

exports.findUserWithEmail = function(email) {

  if (!email || email.length < 1)                   return null;
  if (email_handler.findEmailAddresses(email) < 1)  return null;

  return "he!";
}