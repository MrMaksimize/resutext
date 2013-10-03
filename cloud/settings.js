// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  app.post('/update-settings', function(req, res) {
    /*var username = req.body.username;
    var password = req.body.password;

    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);

    user.signUp().then(function(user) {
      res.redirect('/');
    }, function(error) {
      // Show the error message and let the user try again
      res.render('signup', { flash: error.message });
    });*/
    console.log(req.body);
    res.render('hello', { message: req.body.linkedin });

    var UserSettings = Parse.Object.extend("UserSettings");
    var userSettings = new UserSettings();

    userSettings.set("linkedin", req.body.linkedin);
    userSettings.set("user", Parse.User.current());
    userSettings.save(null, {
      success: function(userSettings) {
        console.log('save success');
      },
      error: function(userSettings, error) {
        console.log('failure ' + error.description);
      }
    });
  });

  return app;
}();


