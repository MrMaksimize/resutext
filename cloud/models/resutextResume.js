
// -- Global Vars -- //
var global = require('cloud/globals.js');


// -- Handlers -- //

//function getTinyURL($parseFile) {
//
//
//
// https://parse.com/docs/js/symbols/Parse.Object.html#.extend
// https://parse.com/docs/js_guide
var Resume = Parse.Object.extend({
    // Instance Props,
    className: 'Resume',
    getTinyUrl: function() {
      return this.get('resumeFile');
      Parse.Cloud.httpRequest({
        url: 'http://tiny.cc/',
        params: {
          c : 'rest_api',
          m : 'shorten',
          version : '2.0.3',
          format : 'json',
          longUrl : this,
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
  },
  {
    // Class Properties
    create: function(file, user) {
      var resume = new Resume();
      resume.set('resumeFile', file);
      resume.set('user', user);
      var acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(user), true);
      resume.set(acl);
      return resume.save().then(function(resume){
        user.set('resume', resume);
        return user.save();
      });
    },

    retrieveByUser: function(user) {
      var resume = user.get('resume');
      return resume.fetch();
    }

  }
);


module.exports = Resume;
