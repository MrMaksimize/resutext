// Provides endpoints for user signup and login

module.exports = function(){
  var express = require('express');
  var app = express();

  // Renders the signup page
  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  // Signs up a new user
  app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var user = new Parse.User();
    user.set('username', username);
    user.set('password', password);

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
  });

  // Render the login page
  app.get('/login', function(req, res) {
    res.render('login');
  });

  // Logs in the user
  app.post('/login', function(req, res) {
    Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
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

  /*app.get('/auth', function (req, res) {
  // the first time will redirect to linkedin
    var linkedin = require('cloud/modules/linkedin/linkedin');
    linkedin.initialize(req, res);
  
  });*/

  app.get('/debug', function(req, res) {
    res.cookie('name2', 'val3');
    res.send('Success');
  });





  app.get('/auth', function (req, res) {
  // the first time will redirect to linkedin
  var linkedin = require('cloud/modules/linkedin/linkedin');
  console.log('authtest');
  var http = require('http');
  var url= require('url');
  var querystring= require('qs');
    if (req.url.indexOf('auth')) {
    console.log('init');
    //redirectForAuth(req, res);

    // Check to see if authorization for end user has already been made and skip Oauth dance
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });

    console.log(cookies);
    
    // If we have the access_token in the cookie skip the Oauth Dance and go straight to Step 3
    if (cookies['LIAccess_token']){
      // STEP 3 - Get LinkedIn API Data
      // console.log("we have the cookie value" + cookies['LIAccess_token']);
      //OauthStep3(req, response, cookies['LIAccess_token'], APICalls['peopleSearchWithKeywords']);
      console.log('exec step 3');

    }
    else {
      var queryObject = url.parse(req.url, true).query;

      if (!queryObject.code) {
        // STEP 1 - If this is the first run send them to LinkedIn for Auth
        //redirectForAuth(req, res);
        console.log('REDIRECT FOR AUTH');
        linkedin.getAuthorizationCode(req, res);
      } else {
        console.log('Post Auth');
        // STEP 2 - If they have given consent and are at the callback do the final token request
        //linkedin.callBackPostAuth(req, res, queryObject.code);
        var path = 'https://api.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&code=' + queryObject.code + '&redirect_uri=http://resutext.parseapp.com/auth&client_id=v0wh3ponihe9&client_secret=UmYOhdOAg8aS7dQI';
        Parse.Cloud.httpRequest({
          method: "POST",
          url: path,
          success: function(httpResponse) {
            console.log("status: ");
            console.log(httpResponse.status);
            console.log("headers: ");
            console.log(httpResponse.headers);
            console.log("text: ");
            console.log(httpResponse.text);
            console.log("data: ");
            console.log(httpResponse.data);
            //console.log(httpResponse);
//TODO            var expiresIn 
            var accessToken = httpResponse.data.access_token;
            console.log(accessToken);
            if (accessToken) {
              res.cookie('LIAccess_token', accessToken);
              res.send('Success');
            }
            
          },
          error: function(httpResponse) {
            console.log("status: ");
            console.log(httpResponse.status);
            console.log("headers: ");
            console.log(httpResponse.headers);
            console.log("text: ");
            console.log(httpResponse.text);
            console.log("data: ");
            console.log(httpResponse.data);
            //console.log(httpResponse);
          }
        });
      }
    }
  }

  });

  return app;
}();


