module.exports = function(){
  var express = require('express');
  var app = express();
  var resutextResume = require('cloud/resutextResume');



  app.post('/upload', function(req, res) {
     if (req.body.file) {
       console.log(req.body);
       var user = Parse.User.current();
       resutextResume.saveResumeObject(req.body.file, user);
     }
  });

  app.get('/debug', function(req, res) {

  });

  return app;
}();