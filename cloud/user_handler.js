
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var email_handler = require('cloud/email.js');


// -- User lookup -- //

/*
  var result = user_handler.findUserWithPhone("3128602305").then(function(phone) {
      response.success(phone[0]);
  }, function(error) {
      response.error(error);
  });
*/
exports.findUserWithPhone = function(phone) {

  var NO_USER_MSG = global.ERROR_MESSAGES().no_usr_phone_found;
  
  if (phone_handler.findPhoneNumbers(phone) < 1)  return Parse.Promise.error(NO_USER_MSG);
  
  var filteredPhone = phone_handler.filterPhone(phone);
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