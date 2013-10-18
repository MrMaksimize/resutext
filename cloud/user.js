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

    console.log('user called');

    user.signUp().then(function(user) {
      var UserSettings = Parse.Object.extend("UserSettings");
      var query = new Parse.Query(UserSettings);
      var userSettings = new UserSettings();
      userSettings.set("user", user);
      userSettings.save().then(function(userSettings) {
        user.set("userSettings", userSettings);
        user.save();
        res.redirect('/');
      });
    }, function(error) {
      // Show the error message and let the user try again
      res.render('signup', { flash: error.message });
    });
  };

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
    //createUser('max@maksimize.com', 'test123', 'AQXx_kW4cHLBx2Wow-QfEAH8b3OJOxXe_qrZhxGvW-AvHqBu0MeXxAiZ9OkSOqPzsII53ael41qgUesNx0NbYmANl9r39HIMZrVcDX3o1AI9jfj_UqBXmbWJdFOue2A3q1_978RlcDqKZGBdFOBvIVI6EZulj0nLY40PD_eYoHxdWe2osys', res);
    var crypto = require('crypto');
    var string = crypto.createHash('md5').update('mehok').digest('hex');
    var string2 = crypto.createHash('md5').update('mehok').digest('hex');
    console.log(string);
    console.log(string2);

    var profileID = 'I0-fDtdhnB';
    var string = crypto.createHash('md5').update(profileID).digest('hex');
    var string2 = crypto.createHash('md5').update(profileID).digest('hex');
    console.log(string);
    console.log(string2);

    var userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo("linkedInID", 'I0-fDtdhnB');
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
                  res.redirect('/');
                });
              });
            }
            else {
              console.log('new user');
              var password = linkedInClient.getParsePasswordFromID(profileResponse.data.id, clientSettings.APIKeySecret);
              createUser(profileResponse.data.emailAddress, password, profileResponse.data.id, clientSettings.accessToken, res);
            }
          },
          error: function(error) {
            console.log('llokup failed');
            console.log(error);
          }
        });

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
                  res.redirect('/');
                });
              });
            }
            else {
              console.log('new user');
              var password = linkedInClient.getParsePasswordFromID(profileResponse.data.id, clientSettings.APIKeySecret);
              createUser(profileResponse.data.emailAddress, password, profileResponse.data.id, clientSettings.accessToken, res);
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


