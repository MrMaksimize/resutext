var http = require('http');
var url= require('url');
var querystring= require('qs');

var APIKey = 'v0wh3ponihe9';
var APIKeySecret = 'UmYOhdOAg8aS7dQI';
var APIVersion = "v1";
var APIScope = '';
var DefaultAPIScope = 'r_basicprofile r_fullprofile r_emailaddress r_network r_contactinfo rw_nus rw_groups w_messages';
var restBase = 'https://api.linkedin.com/v1';
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

exports.initialize = function(api_key, api_key_secret, callback_url, api_scope) {
  APIKey = api_key;
  APIKeySecret = api_key_secret;
  APIScope = api_scope ? api_scope : DefaultAPIScope;
  callbackURL = callback_url;
}

exports.getAuthorizationCode = function (req, res) {
  var location = 'https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=' 
                  + APIKey + '&scope=' 
                  + APIScope + '&state=RNDM_' 
                  + randomState(18) + '&redirect_uri=' 
                  + callbackURL;
  res.redirect(location);
}


exports.getAccessToken = function(req, res, authCode) {
  // https://api.linkedin.com/uas/oauth2/accessToken?grant_type=authorization_code&code=CODEHERE&redirect_uri=http://resutext.parseapp.com/auth&client_id=v0wh3ponihe9&client_secret=UmYOhdOAg8aS7dQI
  console.log("Get Access Token");

  console.log('Post Auth');
  Parse.Cloud.httpRequest({
    method: "POST",
    url: 'https://api.linkedin.com/uas/oauth2/accessToken', // Todo to variables abstract
    params: {
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: 'http://resutext.parseapp.com/auth',
      client_id: 'v0wh3ponihe9',
      client_secret: 'UmYOhdOAg8aS7dQI'
    }
    success: function(httpResponse) {
        console.log("status: ");
        console.log(httpResponse.status);
        console.log("headers: ");
        console.log(httpResponse.headers);
        console.log("text: ");
        console.log(httpResponse.text);
        console.log("data: ");
        console.log(httpResponse.data);

        var accessToken = httpResponse.data.access_token;
        console.log(accessToken);
        if (accessToken) {
          console.log('Set Cookie');
          res.cookie('LIAccess_token', accessToken);
        }
    }
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

exports.executeRequest = function(access_token, request_path, callbackFunction) {
  if (APICall.indexOf("?")>=0) {
    var JSONformat="&format=json";
  } else {
    var JSONformat="?format=json";
  }
  
  var path = 'https://api.linkedin.com/' + APIVersion +'/' + APICallPath
}

exports.step3 = function(req, res, access_token, APICall, callback) {
  console.log("Step3");

  if (APICall.indexOf("?")>=0) {
    var JSONformat="&format=json";
  } else {
    var JSONformat="?format=json";
  }

  var APICallPath = APICalls[APICall];

  var path = 'https://api.linkedin.com/' + APIVersion +'/' + APICallPath + JSONformat + '&oauth2_access_token=' + access_token;

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
    }
  });


}



var APICalls = [];

// My Profile and My Data APIS
APICalls['myProfile'] = 'people/~:(first-name,last-name,headline,picture-url)';
APICalls['myConnections'] = 'people/~/connections';
APICalls['myNetworkShares'] = 'people/~/shares';
APICalls['myNetworksUpdates'] = 'people/~/network/updates';
APICalls['myNetworkUpdates'] = 'people/~/network/updates?scope=self';

// PEOPLE SEARCH APIS
// Be sure to change the keywords or facets accordingly
APICalls['peopleSearchWithKeywords'] = 'people-search:(people:(id,first-name,last-name,picture-url,headline),num-results,facets)?keywords=Hacker+in+Residence';
APICalls['peopleSearchWithFacets'] = 'people-search:(people,facets)?facet=location,us:84';

// GROUPS APIS
// Be sure to change the GroupId accordingly
APICalls['myGroups'] = 'people/~/group-memberships?membership-state=member';
APICalls['groupSuggestions'] = 'people/~/suggestions/groups';
APICalls['groupPosts'] = 'groups/12345/posts:(title,summary,creator)?order=recency';
APICalls['groupDetails'] = 'groups/12345:(id,name,short-description,description,posts)';

// COMPANY APIS
// Be sure to change the CompanyId or facets accordingly
APICalls['myFollowingCompanies'] = 'people/~/following/companies';
APICalls['myFollowCompanySuggestions'] = 'people/~/suggestions/to-follow/companies';
APICalls['companyDetails'] = 'companies/1337:(id,name,description,industry,logo-url)';
APICalls['companySearch'] = 'company-search:(companies,facets)?facet=location,us:84';

// JOBS APIS
// Be sure to change the JobId or facets accordingly
APICalls['myJobSuggestions'] = 'people/~/suggestions/job-suggestions';
APICalls['myJobBookmarks'] = 'people/~/job-bookmarks';
APICalls['jobDetails'] = 'jobs/1452577:(id,company:(name),position:(title))';
APICalls['jobSearch'] = 'job-search:(jobs,facets)?facet=location,us:84';

exports.initialize2 = function(req, res) {
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



