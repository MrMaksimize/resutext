var http = require('http');
var url= require('url');
var querystring= require('qs');

var APIKey = 'v0wh3ponihe9';
var APIKeySecret = 'UmYOhdOAg8aS7dQI';
var APIScope = 'r_basicprofile r_fullprofile r_emailaddress r_network r_contactinfo rw_nus rw_groups w_messages';
var consumerSecret = '4d0c18d6-2576-47b5-9919-644467850a9b';
var consumerKey = '9e6a295d-b6c1-4caf-bfd0-cea3e2bcdd09';
var OAuth = require('cloud/modules/oauth/oauth').OAuth;
var requestTokenURL = 'https://api.linkedin.com/uas/oauth/requestToken';
var acessTokenURL = 'https://api.linkedin.com/uas/oauth/accessToken';
var restBase = 'http://api.linkedin.com/v1';
var callbackURL = 'http://resutext.parseapp.com/auth';
var paramAppender = "?";
var hasParameters = /\/*\?/i;
var rest_base = 'http://api.linkedin.com/v1';
var client = {};

var randomState = function(howLong) {
  howLong=parseInt(howLong);

  if (!howLong || howLong<=0) {
    howLong=18;
  }
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

  for (var i = 0; i < howLong; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}


exports.getAuthorizationCode = function (req, res) {
  var location = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' 
                  + APIKey + '&scope=' 
                  + APIScope + '&state=RNDM_' 
                  + randomState(18) + '&redirect_uri=' 
                  + callbackURL;
  res.redirect(location);
}

exports.getAccessToken = function(request, response, code) {
  // https://api.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&code=CODEHERE&redirect_uri=http://resutext.parseapp.com/auth&client_id=v0wh3ponihe9&client_secret=UmYOhdOAg8aS7dQI
  console.log("Step2");

  var path = "https://api.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&code=" 
    + code + "&redirect_uri=" 
    + callbackURL + "&client_id=" 
    + APIKey + "&client_secret=" 
    + APIKeySecret;

    console.log(path);

  Parse.Cloud.httpRequest({
    method: "POST",
    url: path,
    success: function(httpResponse) {
      console.log("statusCode: ", httpResponse.statusCode);
      console.log("headers: ", res.headers);
      console.log(httpResponse);
    },
    error: function(httpResponse) {
      console.log("statusCode: ", httpResponse.statusCode);
      console.log("headers: ", res.headers);
      console.log(httpResponse);
    }
  });
}

exports.initialize = function(req, res) {
  if (req.url == '/auth') {
    console.log('init');
    //redirectForAuth(req, res);

    // Check to see if authorization for end user has already been made and skip Oauth dance
    var cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
      var parts = cookie.split('=');
      cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    
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
        redirectForAuth(req, res);
      } else {
        // STEP 2 - If they have given consent and are at the callback do the final token request
        callBackPostAuth(req, res, queryObject.code);
      }
    }
  }
}

    /*var req = https.request(options, function(res) {
      console.log("statusCode: ", res.statusCode);
      console.log("headers: ", res.headers);

      res.on('data', function(d) {
        // STEP 3 - Get LinkedIn API Data
        // We have successfully completed Oauth and have received our access_token.  Congrats! 
        // Now let's make a real API call (Example API call referencing APICalls['peopleSearchWithKeywords'] below)
        // See more example API Calls at the end of this file

        access_token = JSON.parse(d).access_token;

        var ExpiresIn29days = new Date();
        ExpiresIn29days.setDate(in30days.getDate() + 29);
        response.writeHead(200, {
          'Set-Cookie':'LIAccess_token=' + access_token + '; Expires=' + ExpiresIn29days
        });

        OauthStep3(request, response, access_token, APICalls['peopleSearchWithKeywords']);
      });
    });

    req.on('error', function(e) {
      console.error("There was an error with our Oauth Call in Step 2: " + e);
      response.end("There was an error with our Oauth Call in Step 2");
    });
    req.end();
  };*/



