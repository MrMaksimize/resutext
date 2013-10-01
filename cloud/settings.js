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
  });

  return app;
}();


