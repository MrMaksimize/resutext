
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Experts -- //
var phone_handler = require('cloud/phone.js');
var email_handler = require('cloud/email.js');


// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  // Renders the signup page
  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  // Signs up a new user
  app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);

    user.signUp().then(function(user) {
      res.redirect('/');
    }, function(error) {
      // Show the error message and let the user try again
      res.render('signup', { flash: error.message });
    });
  });

  // Render the login page
  app.get('/login', function(req, res) {
    res.render('login');
  });

  // Logs in the user
  app.post('/login', function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
      res.redirect('/');
    }, function(error) {
      // Show the error message and let the user try again
      res.render('login', { flash: error.message });
    });
  });

  // Logs out the user
  app.get('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });

  return app;
}();


// -- Public User Constructor -- //

exports.makeUser = function(email, firstName, lastName, phone, resume) {

  if (!email || email.length < 1)          return null;
  if (!firstName || firstName.length < 1)  return null;
  if (!lastName || lastName.length < 1)    return null;
  if (!phone || phone.length < 10)         return null;
  if (!resume || resume.length < 5)        return null;

  if (phone_handler.findPhoneNumbers(phone) < 1)    return null;
  if (email_handler.findEmailAddresses(email) < 1)  return null;
  if (checkResumeURL(resume) < 1)                   return null;

  return new USER(email, firstName, lastName, phone, resume);
}

function checkResumeURL(StrObj) {
  var resumeArray = [];
  resumeArray = StrObj.match("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|localhost|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return resumeArray;
}


// -- USER OBJECT -- //

/*
 * User Object, includes:
 * - Email
 * - First name
 * - Last name
 * - Phone
 * - Resume URL
 */
function USER(email, firstName, lastName, phone, resume)
{
  this.email = email;
  this.firstName = firstName;
  this.lastName = lastName;
  this.phone = phone;
  this.resume = resume;
}

USER.prototype.register = function userRegister() {
  console.log("Registering " + this);
  
  var user = new Parse.User();
   
  user.signUp({
    username: this.email,
    password: "resutext",
    email: this.email,
    phone: this.phone,
    firstName: this.firstName,
    lastName: this.lastName,
    resume: this.resume
  }, {
    success: function(user) {
      // Hooray! Let them use the app now.
      alert('New object created with objectId: ' + user.id);
      console.log('New object created with objectId: ' + user.id);
    },
    error: function(user, error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
      console.log('Failed to create new object, with error code: ' + error.description);
    }
  });
}

USER.prototype.get = function userGet() {
  return { email: this.email, firstName: this.firstName, lastName: this.lastName, phone: this.phone, resume: this.resume };
}

USER.prototype.toString = function userToString() {
  return this.firstName + " " + this.lastName + ", Mail: " + this.email + ", Phone: " + this.phone + ", Resume at: " + this.resume;
}