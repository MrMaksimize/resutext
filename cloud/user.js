
// Provides endpoints for user signup and login
module.exports = function(){
  var express = require('express');
  var app = express();
  var linkedInClient = require('cloud/modules/linkedin/linkedin');
  //var resutextUser = require('cloud/resutext-user');
  var resutextUser = require('cloud/models/resutextUser');

    // Logs out the user
  app.get('/logout', function(req, res) {
    resutextUser.logOut();
    res.redirect('/');
  });

  app.get('/auth', function (req, res) {
    linkedInClient.initialize({
        APIKey: 'v0wh3ponihe9',
        APIKeySecret: 'UmYOhdOAg8aS7dQI',
        callbackURL: 'https://resutext.parseapp.com/user/auth',
    });
    linkedInClient.authenticate(req, res).then(function(result){
      // Three things can happen here;
      // We can get a redirect call,
      // An http request result
      // or nothing.
      console.log('result');
      console.log(result);
      if (typeof result == 'string' &&
        result != 'authentication_established') {
        // Redirect
        console.log('redirect');
        res.redirect(result);
      }
      else {
        console.log('get current prof');
        linkedInClient.getCurrentUserProfile().then(function(profileResponse){
          console.log('profile response');
          console.log(profileResponse.data);
          resutextUser.loginOrCreateFromLinkedIn({
            'email': profileResponse.data.emailAddress,
            'linkedInID': profileResponse.data.id
          }).then(function(userFound){
            console.log('user Found');
            console.log(userFound);
            console.log(Parse.User.current());
            res.redirect('/');
          },
          function(error) {
            console.log('I FAILED.');
            console.log(error);
            res.send(error);
          });
        });
      }
    });



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
