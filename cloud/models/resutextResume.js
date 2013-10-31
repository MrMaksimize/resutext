
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
      return 'hi';
    }
  },
  {
    // Class Properties
    create: function(file, user) {
      var resume = new Resume();
      resume.set('resume', file);
      resume.set('user', user);
      return resume.save();
    }
  }
);


module.exports = Resume;
