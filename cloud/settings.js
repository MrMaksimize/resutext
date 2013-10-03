// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  app.post('/update-settings', function(req, res) {
    //console.log(req.body);
    res.render('hello', { message: req.body.linkedin });
    var userSettings = Parse.User.current().get('userSettings');
    userSettings.set("linkedin", req.body.linkedin);
    userSettings.save();
  });

  return app;
}();


