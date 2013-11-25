
// Provides endpoints for user signup and login
module.exports = function(){
  var express = require('express');
  var app = express();
  var linkedInClient = require('cloud/modules/linkedin/linkedin');
  //var resutextUser = require('cloud/resutext-user');
  var User = require('cloud/models/resutextUser');
  var Resume = require('cloud/models/resutextResume');

  // Logs out the user
  app.get('/logout', function(req, res) {
    User.logOut();
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
          User.loginOrCreateFromLinkedIn(profileResponse.data).then(function(userFound){
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

  app.post('/update-settings', function(req, res) {
    //console.log(req.body);
    //res.render('hello', { message: req.body.linkedin });
    //TODO refactor when user object is a bit more defined.
    console.log(req.body);
    var user = User.current();
    user.save({
      "firstName": req.body.firstName,
      "lastName": req.body.lastName,
      "headline": req.body.headline,
      "linkedin": req.body.linkedin
    }).then(function(user){
      if (req.body.file) {
        console.log('got file');
        return Resume.getFromUser(user);
      }
      else {
        console.log('sending success');
        res.send('success');
      }
    }).then(function(resume) {
      var updatedResume = resume || new Resume({'user': user});
      updatedResume.set('resumeFile', req.body.file);
      return updatedResume.save();
    }).then(function(updatedResume) {
      return user.save({"resume": updatedResume });
    }).then(function(user) {
      res.send('Success');
    }, function(error) {
      console.log(error);
    });
  });

  app.get('/resume', function(req, res) {
    Resume.getTinyURLFromUser(User.current()).then(function(tinyURL) {
      res.send({'tiny': tinyURL});
    });
  });


  return app;
}();
