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
    //var rt = new resutextResume();
    //var debug = rt.getTinyUrl();
    /*resutextResume.retrieveByUser(Parse.User.current()).then(function(resume){
      console.log(resume);
      var ph = resume.get('resumeFile');
      console.log(ph);
      //console.log(ph.url());
    });*/
    var user = Parse.User.current();
    var resume = user.get('resume');

    console.log(resume);

    resume.fetch({
      success: function(resume) {
        console.log(resume);
        var ph = resume.get('resumeFile').url();
        console.log(ph);
      }
    });

  });

  return app;
}();


