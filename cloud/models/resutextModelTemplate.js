
var _ = require('underscore');
// TODO do we need this?
// -- Global Vars -- //
var global = require('cloud/globals.js');


// -- Handlers -- //

// https://parse.com/docs/js/symbols/Parse.Object.html#.extend
// https://parse.com/docs/js_guide
var User = Parse.User.extend(
  {
    // Instance Props,
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


  },
  {
    // Class Properties / Static or Overloaded Constructors
  }
);


module.exports = User;
