
// Provides endpoints for user signup and login
module.exports = function(){
  var express = require('express');
  var app = express();
  //var resutextUser = require('cloud/resutext-user');
  var resutextUser = require('cloud/models/resutextUser');

    // Logs out the user
  app.get('/logout', function(req, res) {
    resutextUser.logOut();
    res.redirect('/');
  });

  app.get('/auth', function (req, res) {
    resutextUser.loginWithLinkedIn(req, res);
  });

  app.get('/debug', function (req, res) {

  });

  return app;
}();
