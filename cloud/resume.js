
// -- Global Vars -- //
var global = require('cloud/globals.js');


// -- Handlers -- //

//function getTinyURL($parseFile) {
exports.getTinyURL = function($parseFile) {
  Parse.Cloud.httpRequest({
    url: 'http://tiny.cc/',
    params: {
      c : 'rest_api',
      m : 'shorten',
      version : '2.0.3',
      format : 'json',
      longUrl : $parseFile.url,
      login  : 'resutext',
      apiKey : 'ecc1a578-f5b7-4aaa-beb1-d1510ed008ee'
    },
    success: function(httpResponse) {
      var tinyRes = JSON.parse(httpResponse.text);
      if (tinyRes['errorCode'] != 0) {
        console.error('Request failed with response code ' + httpResponse.status);
        //response.error("Failed to get tiny");
      }
      else {
        var tinyURL = tinyRes['results']['short_url'];
        //response.success("Got tiny " + tinyURL);
      }
    },
    error: function(httpResponse) {
      console.error('Request failed with response code ' + httpResponse.status);
      //response.error("Failed to get tiny");
    }
  });
}

exports.uploadResumeForUser = function(user) {

  var NO_SAVE = global.ERROR_MESSAGES().could_not_save;  

  /*
   * This is what the code should look like to
   * grab a file from express form
   * 
  var fileUploadControl = $("#resumeFile")[0];
  if (fileUploadControl.files.length < 1) {
    response.error("Invalid file");
    return;
  }
  
  var file = fileUploadControl.files[0];
  var parseFile = new Parse.File(fileName, file);
  */
  
  // Testing file
  var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
  var parseFile = new Parse.File("myfile.txt", { base64: base64 });
  
  return parseFile.save().then(function() {
    
    var resumeObj = new Parse.Object("Resume");
    resumeObj.set("resume", parseFile);
    
    resumeObj.set("user", user);
    return resumeObj.save().then(function() {
      return "Success!";
    },
    function(error) {
      return Parse.Promise.error(NO_SAVE);
    });
  
  });
}

exports.retrieveResumeForUser = function(user) {
  
  var NO_RESUME_MSG = global.ERROR_MESSAGES().no_resume_found;
  
  var query = new Parse.Query("Resume");
  query.equalTo("user", user[0]);

  return query.find( function(resumes) {
    if (resumes.length < 1) return Parse.Promise.error(NO_RESUME_MSG);
    return resumes[0];
  },
  function(error) {
    return Parse.Promise.error(NO_RESUME_MSG);
  });
}