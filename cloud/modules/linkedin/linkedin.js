var http = require('http');
var url = require('url');
var qs = require('qs');
var _ = require('underscore');
var crypto = require('crypto');

var settings = {
  //APIKey: 'v0wh3ponihe9',
  //APIKeySecret: 'UmYOhdOAg8aS7dQI',
  APIScope: 'r_basicprofile r_fullprofile r_emailaddress r_network r_contactinfo rw_nus rw_groups w_messages',
  restBase: 'https://api.linkedin.com/v1',
  //callbackURL:
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

exports.getCurrentSettings = function(setting) {
  if (setting) {
    return settings[setting];
  }
  return settings;
}

exports.getAuthNextStep = function(req) {
  if (!settings.accessToken) {
    settings.accessToken = module.exports.getAcessTokenFromCookies(req);
  }
  if (!settings.accessToken) {
    var queryObject = url.parse(req.url, true).query;
    if (!queryObject.code) {
      console.log('STEP 1');
      console.log('REDIRECT FOR AUTH');
      //module.exports.getAuthorizationCode(req, res);
      return 'getAuthCode';
    }
    else {
      console.log('STEP2');
      //module.exports.getAccessToken(req, res, queryObject.code, successCallback, failureCallback);
      return 'getAccessToken';
    }
  }
  else {
    console.log('have access token');
    //res.redirect(settings.redirectPostAuth);
    //successCallback(res);
    return 'complete';
  }

}

exports.authenticate = function(req, res) {
  console.log('auth called');
  var queryObject = url.parse(req.url, true).query;
  var nextStep = module.exports.getAuthNextStep(req);
  console.log('Next Step.');
  console.log(nextStep);

  if (nextStep == 'getAuthCode') {
    // Will redirect.
   return Parse.Promise.as(module.exports.getAuthRequestURL());
  }
  else if (nextStep == 'getAccessToken') {
      return module.exports.getAccessToken(req, res, queryObject.code);
  }
  else {
    return Parse.Promise.as('authentication_established');
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

exports.getAuthRequestURL = function () {
  var location = 'https://www.linkedin.com/uas/oauth2/authorization';
  location = location + '?' + qs.stringify({
    'response_type': 'code',
    'client_id': settings.APIKey,
    'scope': settings.APIScope,
    'state': 'RNDM_' + randomState(18),
    'redirect_uri': settings.callbackURL
  });
  return location;
}


exports.getAccessToken = function(req, res, authCode, successCallback, failureCallback) {
  console.log("Get Access Token");

  console.log('Post Auth');
  console.log(authCode)
  /*Parse.Cloud.httpRequest({
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
        successCallback(res);
      }
    },
    error: function(httpResponse) {
      logResponse(httpResponse);
      failureCallback(res);
    }
  });*/
  console.log(settings);
  console.log('shit');
  var params = {
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: settings.callbackURL,
      client_id: settings.APIKey,
      client_secret: settings.APIKeySecret
    };
    console.log(params);

  return Parse.Cloud.httpRequest({
    method: "POST",
    url: 'https://api.linkedin.com/uas/oauth2/accessToken', // Todo to variables abstract
    params: {
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: settings.callbackURL,
      client_id: settings.APIKey,
      client_secret: settings.APIKeySecret
    },
  }).then(function(httpResponse){
      logResponse(httpResponse);
      console.log(httpResponse.data.access_token);
      if (httpResponse.data.access_token) {
        settings.accessToken = httpResponse.data.access_token;
        console.log('Set Cookie');
        res.cookie('LIAccess_token', settings.accessToken);
      }
  }, function(error){
      console.log(error);
    });

}

exports.getParsePasswordFromID = function(profileID, salt) {
  if(!salt || salt == null) {
    salt = settings.APIKeySecret;
  }
  console.log('SALT: ' + salt);
  return crypto.createHash('md5').update(profileID + 'LiAccess' + salt).digest('hex');
}

exports.executeRequest = function(request_path) {
  console.log('requesting');
  var JSONformat = request_path.indexOf("?") >= 0 ?
                   "&format=json" : "?format=json";
  var path = settings.restBase + '/' + request_path + JSONformat
             +'&oauth2_access_token=' + settings.accessToken;

  return Parse.Cloud.httpRequest({
    method: "GET",
    url: path
  });
}

exports.getCurrentUserProfile = function() {
  return module.exports.executeRequest('people/~:(first-name,last-name,headline,id,email-address,public-profile-url)');
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


