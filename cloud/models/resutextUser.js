
var _ = require('underscore');
// TODO do we need this?
// -- Global Vars -- //
var global = require('cloud/globals');
var linkedInClient = require('cloud/modules/linkedin/linkedin');


// -- Handlers -- //

// https://parse.com/docs/js/symbols/Parse.Object.html#.extend
// https://parse.com/docs/js_guide
var User = Parse.User.extend(
  {
    test: function() {
      return 'test passes';
    }
  },
  {
    // Class Properties / Static or Overloaded Constructors
    createFromLinkedIn: function(email, password, linkedInID, accessToken) {
      var user = new User({
        'username': email,
        'email': email,
        'password': password,
        'linkedInID': linkedInID,
        'LIAccessToken': accessToken
      });
      return user.signUp();
    }
  }
);


module.exports = User;
