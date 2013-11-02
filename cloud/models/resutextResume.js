
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

    // This is a constructor.  Looks like constructors act as instance variables and simply apply
    // things to the model instance.  We don't really care about that.  We want to define a static
    // Constructor below;
    /*constructor: function(attributes, options) {
      console.log('construction');
      Parse.Object.apply(this, arguments);
    },*/

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
    },// Tiny
    enforceACL: function(user) {
      var acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setWriteAccess(user, true);
      this.set(acl);
      return this;
    }, // enforceACL
    // Override fetch method cuz the regular one sucks.
    fetch: function() {
      var query = new Parse.Query(Resume);
      return query.get(this.id);
    },// fetch
    getFileURL: function() {
      var promise = new Parse.Promise();
      this.fetch(this.id).then(function(result){
        promise.resolve(result.get('resumeFile').url());
      });
      return promise;
    },
  },
  {
    // Class Properties / Static Constructors
    /*create: function(file, user) {
      console.log(file);
      var resume = new Resume();
      resume.set('resumeFile', file);
      resume.set('user', user);
      return resume;
    },
    // Replacment for create
    spawn: function(properties) {
      var resume = new Resume();
      // Iterate though and set props.
    },*/
  }
);


module.exports = Resume;
