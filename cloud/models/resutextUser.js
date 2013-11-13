
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
    loginOrCreateFromLinkedIn: function(liProfileData) {
      console.log('Find or create from linked in');
      return User.getByLinkedInID(liProfileData.id).then(function(result){
        console.log('get by li result');
        console.log(result);
        if (result == null) {
          console.log('new user');
          return User.createFromLinkedIn(liProfileData);
        }
        else {
          return User.loginFromLinkedIn(result);
        }
      });
    },

    createFromLinkedIn: function(liProfileData) {
      console.log('new user');
      console.log(liProfileData);
      return User.signUp(liProfileData.emailAddress,
      linkedInClient.getParsePasswordFromID(liProfileData.id), {
        'email': liProfileData.emailAddress,
        'linkedInID': liProfileData.id,
        'LIAccessToken': linkedInClient.getCurrentSettings('accessToken'),
        'linkedin': liProfileData.publicProfileUrl,
        'firstName': liProfileData.firstName,
        'lastName': liProfileData.lastName,
        'headline': liProfileData.headline
      });
    },

    loginFromLinkedIn: function(userData) {
      console.log('existing user');
      console.log(userData);
      console.log(userData.get('email'));
      console.log(userData.get('linkedInID'));
      return User.logIn(userData.get('email'),
      linkedInClient.getParsePasswordFromID(userData.get('linkedInID')));
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
