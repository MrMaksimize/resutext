
// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();
  var resutextUser = require('cloud/resutext-user');


    // Logs out the user
  app.get('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });

  app.get('/debug', function(req, res) {

  });

  app.get('/auth', function (req, res) {
    resutextUser.loginWithLinkedIn(req, res);
  });

  return app;
}();
