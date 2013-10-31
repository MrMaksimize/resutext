module.exports = function(){
  var express = require('express');
  var app = express();
  var resutextResume = require('cloud/models/resutextResume');

  app.post('/upload', function(req, res) {
    console.log('upload');
     if (req.body.file) {
       console.log(req.body);
       var user = Parse.User.current();
       console.log(user);
       resutextResume.create(req.body.file, user).then(function(){
         console.log('calling success');
         res.send('Success');
       });
     }
  });

  app.get('/debug', function(req, res) {

  });

  return app;
}();
