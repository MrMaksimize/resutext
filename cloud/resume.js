
// -- Global Vars -- //
var global = require('cloud/globals.js');


// -- Handlers -- //

exports.uploadResume = function(resume, response) {

  /*
   *Testing dummy
   *
    var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
    var file = new Parse.File("myfile.txt", { base64: base64 });
  */
  var currentUser = Parse.User.current();
  if (!currentUser) {
    response.error("User currently not logged in");
    return;
  }

  var fileUploadControl = $("#resumeFile")[0];
  if (fileUploadControl.files.length < 1) {
    response.error("Invalid file");
    return;
  }
    
  var file = fileUploadControl.files[0];
  var parseFile = new Parse.File(fileName, file);
  parseFile.save().then(function() {

    var resumeObj = new Parse.Object("Resume");
    resumeObj.set("resume", parseFile);
    resumeObj.set("user", currentUser);
    resumeObj.save().then(function() {
      response.success();
    });
    
  }, function(error) {
    response.error("Could not save file");
  });
}

exports.retrieveResume = function(response) {
  //var profilePhoto = profile.get("photoFile");
  //$("profileImg")[0].src = profilePhoto.url();
  //Parse.Cloud.httpRequest({ url: profilePhoto.url() }).then(function(response) {
    // The file contents are in response.buffer.
  //});
}