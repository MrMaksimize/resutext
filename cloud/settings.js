// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  var resutextResume = require('cloud/models/resutextResume');

  app.post('/update-settings', function(req, res) {
    //console.log(req.body);
    //res.render('hello', { message: req.body.linkedin });

    var user = Parse.User.current();
    user.set("firstName", req.body.firstName);
    user.set("lastName", req.body.lastName);
    user.set("headline", req.body.headline);
    user.set("linkedin", req.body.linkedin);
    user.save().then(function(user){
      if (req.body.file) {
        resutextResume.create(req.body.file, user).then(function(){
         console.log('saved');
         res.send('Success');
       });
     }
     else {
       res.send('Success');
     }
    });
  });


  app.get('/settings-debug', function (req, res) {
    //var debug = resutextResume.getTinyUrl();
    var rt = new resutextResume();
    var debug = rt.getTinyUrl();
    console.log(debug);

  });

  return app;
}();


