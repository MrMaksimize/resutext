var http = require('http');
var url = require('url');
var qs = require('qs');
var _ = require('underscore');

var settings = {
  APIKey: 'v0wh3ponihe9',
  APIKeySecret: 'UmYOhdOAg8aS7dQI',
  callbackURL: '',
  redirectPostAuth: '',
  APIScope: 'r_basicprofile r_fullprofile r_emailaddress r_network r_contactinfo rw_nus rw_groups w_messages',
  restBase: 'https://api.linkedin.com/v1',
  accessToken: null
}

// Helpers
var randomState = function(stateLength) {
  howLong = parseInt(stateLength);

  if (!howLong || howLong <= 0) {
    howLong = 18;
  }
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";

  for (var i = 0; i < howLong; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

var logResponse = function(httpResponse) {
  console.log("status: ");
  console.log(httpResponse.status);
  console.log("headers: ");
  console.log(httpResponse.headers);
  console.log("text: ");
  console.log(httpResponse.text);
  console.log("data: ");
  console.log(httpResponse.data);
}

// exports is an object that is returned as a result of a require call.
exports.initialize = function(newSettings) {
  settings = _.extend(settings, newSettings);
}

exports.authenticate = function(req, res, successCallback, failureCallback) {
  if (!settings.accessToken) {
    settings.accessToken = module.exports.getAcessTokenFromCookies(req);
  }
  if (!settings.accessToken) {
    var queryObject = url.parse(req.url, true).query;
    if (!queryObject.code) {
      console.log('STEP 1');
      console.log('REDIRECT FOR AUTH');
      module.exports.getAuthorizationCode(req, res);
    }
    else {
      console.log('STEP2');
      module.exports.getAccessToken(req, res, queryObject.code, successCallback, failureCallback);
    }
  }
  else {
    console.log('have access token');
    //res.redirect(settings.redirectPostAuth);
    successCallback(res);
  }
}

exports.authenticated = function() {
  return settings.accessToken.length != 0;
}

exports.getAcessTokenFromCookies = function(req) {
  var cookies = {};
  req.headers.cookie && req.headers.cookie.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  return cookies['LIAccess_token'] ? cookies['LIAccess_token'] : null;
}

exports.getAuthorizationCode = function (req, res) {
  var location = 'https://www.linkedin.com/uas/oauth2/authorization';
  location = location + '?' + qs.stringify({
    'response_type': 'code',
    'client_id': settings.APIKey,
    'scope': settings.APIScope,
    'state': 'RNDM_' + randomState(18),
    'redirect_uri': settings.callbackURL
  });
  res.redirect(location);
}


exports.getAccessToken = function(req, res, authCode, successCallback, failureCallback) {
  console.log("Get Access Token");

  console.log('Post Auth');
  console.log(authCode)
  Parse.Cloud.httpRequest({
    method: "POST",
    url: 'https://api.linkedin.com/uas/oauth2/accessToken', // Todo to variables abstract
    params: {
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: settings.callbackURL,
      client_id: settings.APIKey,
      client_secret: settings.APIKeySecret
    },
    success: function(httpResponse) {
      logResponse(httpResponse);
      console.log(httpResponse.data.access_token);
      if (httpResponse.data.access_token) {
        settings.accessToken = httpResponse.data.access_token;
        console.log('Set Cookie');
        res.cookie('LIAccess_token', settings.accessToken);

        //res.redirect(settings.redirectPostAuth);
        successCallback(res);
      }
    },
    error: function(httpResponse) {
      logResponse(httpResponse);
      failureCallback(res);
    }
  });
}

exports.executeRequest = function(request_path, callbackFunction) {
  if (request_path.indexOf("?")>=0) {
    var JSONformat="&format=json";
  } else {
    var JSONformat="?format=json";
  }
  var path = settings.restBase
             + '/' + request_path
             + JSONformat
             +'&oauth2_access_token=' + settings.accessToken;

  Parse.Cloud.httpRequest({
    method: "GET",
    url: path,
    success: function(httpResponse) {
      logResponse(httpResponse);
      callbackFunction(httpResponse);
    },
    error: function(httpResponse) {
        logResponse(httpResponse);
    }
  });
}

exports.getCurrentUserProfile = function(successCallback) {
  module.exports.executeRequest('people/~:(first-name,last-name,headline,picture-url)', successCallback);
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



