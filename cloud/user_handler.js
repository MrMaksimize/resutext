
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

/*
  var result = user_handler.findUserWithPhone("3128602305").then(function(phone) {
      response.success(phone[0]);
  }, function(error) {
      response.error(error);
  });
*/
exports.findUserWithPhone = function(phone) {

  if (phone_handler.findPhoneNumbers(phone) < 1)  return Parse.Promise.error(NO_USER_MSG);

  var query = new Parse.Query(Parse.User);
  query.equalTo("phone", phone);
  
  return query.find( function(users) {
    if (users.length < 1) {
      return Parse.Promise.error(NO_USER_MSG);
    }
    return users[0];
  },
  function(error) {
    return Parse.Promise.error(NO_USER_MSG);
  });
}


/*
  var result = user_handler.findUserWithEmail("gefthefrench@gmail.com").then(function(email) {
      response.success(email[0]);
  }, function(error) {
      response.error(error);
  });
*/
exports.findUserWithEmail = function(email) {

  var NO_USER_MSG = global.ERROR_MESSAGES().no_usr_email_found;
  
  if (email_handler.findEmailAddresses(email) < 1)  return Parse.Promise.error(NO_USER_MSG);

  var query = new Parse.Query(Parse.User);
  query.equalTo("email", email);
  return query.find( function(users) {
    if (users.length < 1) {
      return Parse.Promise.error(NO_USER_MSG);
    }
    return users[0];
  },
  function(error) {
    return Parse.Promise.error(NO_USER_MSG);
  });
}