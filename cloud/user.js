// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  // Renders the signup page
  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  var createUser = function(email, password, linkedInID, accessToken, res) {
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


    console.log('user called');

    user.signUp().then(function(user) {
      var UserSettings = Parse.Object.extend("UserSettings");
      var query = new Parse.Query(UserSettings);
      var userSettings = new UserSettings();
      userSettings.set("user", user);
      userSettings.save().then(function(userSettings) {
        user.set("userSettings", userSettings);
        user.save();
        //res.redirect('/');
        promise.resolve(user);
      });
    }, function(error) {
      // Show the error message and let the user try again
      res.render('signup', { flash: error.message });
    });
  };

  var syncCurrentUser = function(userProfile) {
    var user = Parse.User.current();
    var promise = new Parse.Promise();
    if (!user) {
      return promise.reject("No User");
    }
    console.log(userProfile);
    var userSettings = user.get('userSettings');
    userSettings.set('linkedin', userProfile.publicProfileUrl);
    userSettings.save().then(function(result){
      promise.resolve('successful update');
    });

    return promise;
  }

  // Signs up a new user
  app.post('/signup', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    createUser(email, password, null, null, res);
  });

  // Render the login page
  app.get('/login', function(req, res) {
    res.render('login');
  });

  // Logs in the user
  app.post('/login', function(req, res) {
    Parse.User.logIn(req.body.email, req.body.password).then(function(user) {
      res.redirect('/');
    }, function(error) {
      // Show the error message and let the user try again
      res.render('login', { flash: error.message });
    });
  });

  // Logs out the user
  app.get('/logout', function(req, res) {
    Parse.User.logOut();
    res.redirect('/');
  });

  app.get('/debug', function(req, res) {
    console.log('love');
    syncCurrentUser('test').then(function(result){console.log('result: ' + result);});
  });


  app.get('/auth', function (req, res) {
  // the first time will redirect to linkedin
    var linkedInClient = require('cloud/modules/linkedin/linkedin');

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
        console.log('profile response');
        console.log(profileResponse);
        console.log('SETT');
        console.log(linkedInClient.getCurrentSettings());
        var clientSettings = linkedInClient.getCurrentSettings();
        var userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo("linkedInID", profileResponse.data.id);
        // I'm fully aware that using LinkedIN id's for passwords is a terrible idea.  BUT idk what to do for now.
        userQuery.find({
          success: function(results) {
            if (results.length > 0) {
              console.log('user found');
              var userFound = results[0];
              console.log(userFound);
              console.log(userFound.get('email'));
              console.log(clientSettings.APIKeySecret);
              var password = linkedInClient.getParsePasswordFromID(profileResponse.data.id, clientSettings.APIKeySecret);
              console.log(password);
              Parse.User.logIn(userFound.get('email'), password).then(function(user){
                console.log('logging in by lookup')
                console.log(user);
                user.set('LIAccessToken', clientSettings.accessToken);
                user.save().then(function(user) {
                  console.log('user save done.');
                 syncCurrentUser(profileResponse.data).then(function(result){
                   console.log(result);
                   console.log('success sync');
                   res.redirect('/');
                 });
                });
              });
            }
            else {
              console.log('new user');
              var password = linkedInClient.getParsePasswordFromID(profileResponse.data.id, clientSettings.APIKeySecret);
              createUser(profileResponse.data.emailAddress, password, profileResponse.data.id, clientSettings.accessToken, res).then(function(user){
                console.log('promise good');
                console.log('user');
                });
            }
          },
          error: function(error) {
            console.log('llokup failed');
            console.log(error);
          }
        });
        // Attempt to find user by email first.
        //createUser(profileResponse.data.emailAddress, profileResponse.data.lastName, linkedInClient.accessToken, res);
      });
    });

  });

  return app;
}();


