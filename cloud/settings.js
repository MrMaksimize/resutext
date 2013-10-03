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
   /*var UserSettings = Parse.Object.extend("UserSettings");
    var query = new Parse.Query(UserSettings);
    var userSettings = new UserSettings();
    //query.equalTo("user", Parse.User.current());
    query.first({
      success: function(userSettings) {
        console.log('user settings retrieved');
        console.log(userSettings);
      },
      error: function(error) {
        console.log('error');
        console.log(error);
      }
    });
    */
    /*var userSettings = new UserSettings();

    userSettings.set("linkedin", req.body.linkedin);
    userSettings.save(null, {
      success: function(userSettings) {
        console.log('save success');
      },
      error: function(userSettings, error) {
        console.log('failure ' + error.description);
      }
    });*/
  });

  return app;
}();


