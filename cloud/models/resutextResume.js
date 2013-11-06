
var _ = require('underscore');
// TODO do we need this?
// -- Global Vars -- //
var global = require('cloud/globals.js');


// -- Handlers -- //

// https://parse.com/docs/js/symbols/Parse.Object.html#.extend
// https://parse.com/docs/js_guide
var Resume = Parse.Object.extend({
    // Instance Props,
    className: 'Resume',

    // This is a constructor.  Looks like constructors act as instance variables and simply apply
    // things to the model instance.  We don't really care about that.  We want to define a static
    // Constructor below, if we really need to;
    /*constructor: function(attributes, options) {
      console.log('construction');
      Parse.Object.apply(this, arguments);
    },*/

    /*initialize: function() {
      _.bindAll(this);
    },*/

    getTinyURL: function() {
      console.log('hello');
      if (this.has('tinyURL')) {
        console.log('tinyURL saved already');
        return Parse.Promise.as(this.get('tinyURL'));
      }
      console.log('passin by');
      var self = this;
      return Parse.Cloud.httpRequest({
        url: 'http://tiny.cc/',
        params: {
          c : 'rest_api',
          m : 'shorten',
          version : '2.0.3',
          format : 'json',
          longUrl : self.getResumeFileURL(),
          login  : 'resutext',
          apiKey : 'ecc1a578-f5b7-4aaa-beb1-d1510ed008ee'
        }
      }).then(function(httpResponse){
        console.log('response');
        var tinyRes = JSON.parse(httpResponse.text);
        if (tinyRes['errorCode'] != 0) {
          console.error('Request failed with response code ' + httpResponse.status);
          return '';
        }
        else {
          var tinyURL = tinyRes['results']['short_url'];
          self.set('tinyURL', tinyURL);
          self.save();
          return tinyURL;
        }
      });
    }, // tiny

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
    getResumeFileURL: function() {
      return this.get('resumeFile').url();
    }
  },
  {
    // Class Properties / Static or Overloaded Constructors
  }
);


module.exports = Resume;
