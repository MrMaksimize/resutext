
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
    // Routing helper for linkedIN Authentication
    authWithLinkedIn: function(req, res) {
      linkedInClient.initialize({
        APIKey: 'v0wh3ponihe9',
        APIKeySecret: 'UmYOhdOAg8aS7dQI',
        callbackURL: 'http://resutext.parseapp.com/user/auth',
        redirectPostAuth: 'http://resutext.parseapp.com',
        APIScope: 'r_basicprofile r_fullprofile r_emailaddress r_network r_contactinfo rw_nus rw_groups w_messages'
        //accessToken: '' // Access token can be pulled from DB?
      });

      linkedInClient.authenticate(req, res).then(function(result){
        // Three things can happen here;
        // We can get a redirect call,
        // An http request result
        // or nothing.
        if (typeof result == 'string' &&
          result != 'authentication_established') {
          // Redirect
          res.redirect(result);
        }
        else {
          console.log('get current prof');
          linkedInClient.getCurrentUserProfile().then(function(profileResponse){
            console.log('profile response');
            console.log(profileResponse.data);
            return User.findOrCreateFromLinkedIn({
              'email': profileResponse.data.emailAddress,
              'linkedInID': profileResponse.data.id
            });
          }).then(function(userFound){
            console.log(userFound);
          });
        }
      });

    }
  }
);


module.exports = User;
