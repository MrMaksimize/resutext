
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
    },


    updateFromLinkedIn: function(linkedInUserProfile) {
      return this.save({
        'linkedin': linkedInUserProfile.publicProfileUrl,
        'firstName': linkedInUserProfile.firstName,
        'lastName': linkedInUserProfile.lastName,
        'headline': linkedInUserProfile.headline
      });
    }
  },
  {
    // Class Properties / Static or Overloaded Constructors
    loginOrCreateFromLinkedIn: function(userData) {
      console.log('Find or create from linked in');
      return User.getByLinkedInID(userData.linkedInID).then(function(result){
        console.log('get by li result');
        console.log(result);
        if (result == null) {
          console.log('new user');
          return User.createFromLinkedIn(userData);
        }
        else {
          return User.loginFromLinkedIn(userData);
        }
      });
    },

    createFromLinkedIn: function(userData) {
      console.log('new user');
      console.log(userData);
      return User.signUp(userData.email, linkedInClient.getParsePasswordFromID(userData.linkedInID), {
        'email': userData.email,
        'linkedInID': userData.linkedInID,
        'LIAccessToken': linkedInClient.getCurrentSettings('accessToken'),
      });
    },

    loginFromLinkedIn: function(userData) {
      console.log('existing user');
      console.log(userData);
      return User.logIn(userData.email, linkedInClient.getParsePasswordFromID(userData.linkedInID));
    },

    getByLinkedInID: function(linkedInID) {
      console.log('get by linked in ');
      var userQuery = new Parse.Query(User);
      userQuery.equalTo("linkedInID", linkedInID);
      return userQuery.find().then(function(results){
        if (results.length > 0) {
          var userFound = results[0];
          return Parse.Promise.as(userFound);
        }
        else {
          return Parse.Promise.as(null);
        }
      });
    },
  }
);


module.exports = User;
