
var linkedInClient = require('cloud/modules/linkedin/linkedin');

exports.create = function(email, password, linkedInID, accessToken, res) {
  var user = new Parse.User();
  user.set('username', email);
  user.set('email', email);
  user.set('password', password);
  if (linkedInID) {
    user.set('linkedInID', linkedInID);
  }
  if (accessToken) {
    user.set('LIAccessToken', accessToken);
  }
  var promise = new Parse.Promise();
  user.signUp().then(function(user) {
        promise.resolve(user);
  }, function(error) {
     promise.reject("User Not Created");
  });

  return promise;
};

exports.sync = function(userProfile) {
  var user = Parse.User.current();
  var promise = new Parse.Promise();
  if (!user) {
    return promise.reject("No User");
  }
  console.log(userProfile);
  user.set('linkedin', userProfile.publicProfileUrl);
  user.set('firstName', userProfile.firstName);
  user.set('lastName', userProfile.lastName);
  user.set('headline', userProfile.headline);
  user.save().then(function(result){
    promise.resolve(result);
  });

  return promise;
}


exports.loginWithLinkedIn = function(req, res) {

  console.log('initialize');

  linkedInClient.initialize({
    APIKey: 'v0wh3ponihe9',
    APIKeySecret: 'UmYOhdOAg8aS7dQI',
    callbackURL: 'http://resutext.parseapp.com/auth',
    redirectPostAuth: 'http://resutext.parseapp.com',
    APIScope: 'r_basicprofile r_fullprofile r_emailaddress r_network r_contactinfo rw_nus rw_groups w_messages'
    //accessToken: '' // Access token can be pulled from DB?
  });

  linkedInClient.authenticate(req, res, function(response) {
    console.log('success on authenticate');
    console.log('yay');
    linkedInClient.getCurrentUserProfile(function(profileResponse) {
      var clientSettings = linkedInClient.getCurrentSettings();
      var userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo("linkedInID", profileResponse.data.id);
      // I'm fully aware that using LinkedIN id's for passwords is a terrible idea.  BUT idk what to do for now.
      userQuery.find({
        success: function(results) {
          if (results.length > 0) {
            var userFound = results[0];
            var password = linkedInClient.getParsePasswordFromID(profileResponse.data.id, clientSettings.APIKeySecret);
            Parse.User.logIn(userFound.get('email'), password).then(function(user){
              user.set('LIAccessToken', clientSettings.accessToken);
              user.save().then(function(user) {
                res.redirect('/');
              });
            });
          }
          else {
            var password = linkedInClient.getParsePasswordFromID(profileResponse.data.id, clientSettings.APIKeySecret);
            module.exports.create(profileResponse.data.emailAddress, password, profileResponse.data.id, clientSettings.accessToken, res).then(function(user){
              module.exports.sync(profileResponse.data).then(function(result){
                 console.log(result);
                 res.redirect('/');
              });
            });
          }
        },
        error: function(error) {
          console.log('llokup failed');
          console.log(error);
        }
      });
    });
  });
}


