// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  var Resume = require('cloud/models/resutextResume');

  app.post('/update-settings', function(req, res) {
    //console.log(req.body);
    //res.render('hello', { message: req.body.linkedin });
    //TODO refactor when user object is a bit more defined.
    var user = Parse.User.current();
    user.set("firstName", req.body.firstName);
    user.set("lastName", req.body.lastName);
    user.set("headline", req.body.headline);
    user.set("linkedin", req.body.linkedin);
    user.save().then(function(user){
      if (req.body.file) {
        var resume = new Resume({
          'user': user,
          'resumeFile': req.body.file,
        }).enforceACL(user).save().then(function(resume){
          user.set('resume', resume);
          return user.save()
        }).then(function(){
          res.send("Success");
        });
      }
      else {
        res.send('Success');
      }
    });
  });


  app.get('/settings-debug', function (req, res) {
    var user = Parse.User.current();
    var resume = user.get('resume');
    var resu = new Resume({id: resume.id});
    /*resu.fetch().then(getTinyURL().then(function(result){
      console.log(result);
    });*/
    resu.fetch().then(function(resu){
      return resu.getTinyURL();
    }).then(function(tinyURL) {
      console.log('TINY');
      console.log(tinyURL);
    });;



  });

  return app;
}();


