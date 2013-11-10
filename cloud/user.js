
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
    resutextUser.authWithLinkedIn(req, res);
  });

  app.get('/debug', function (req, res) {
   // resutextUser.createFromLinkedIn('max@maksimize.com', 'test123', '1234567', 'boob');
     resutextUser.getByLinkedInID('1234567').then(function(res){
       console.log(res);
     });
   });

  app.get('/testing/:op', function (req, res) {
    res.set({'Content-Type': 'application/json'});
  });

  return app;
}();
