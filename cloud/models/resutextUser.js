
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
    findOrCreateFromLinkedIn: function(userData) {
      console.log('Find or create from linked in');
      User.getByLinkedInID(userData.linkedInID).then(function(result){
        if (result == null) {
          console.log('new user');
          return User.createFromLinkedIn(userData);
        }
        else {
          return result;
        }
      });
    },

    createFromLinkedIn: function(userData) {
      var clientSettings = linkedInClient.getCurrentSettings();
      console.log('create from li');
      return User.signUp(userData.email, '123434343ffuasd0fa', {
        'email': userData.email,
        'linkedInID': userData.linkedInID,
        'LIAccessToken': clientSettings.accessToken,
      });
    },

    getByLinkedInID: function(linkedInID) {
      var userQuery = new Parse.Query(User);
      userQuery.equalTo("linkedInID", linkedInID);
      return userQuery.find().then(function(results){
        if (results.length > 0) {
          var userFound = results[0];
          return userFound;
        }
        else {
          return null;
        }
      });
    },
  }
);


module.exports = User;
