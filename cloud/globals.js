
// -- Temporary vars for site -- //
exports.URLS = function() {
  return {
    resumeURL : "http://bit.ly/MaksimRes",
    resumeURLScribd : "http://bit.ly/MaksimRes1",
    mrmSite : "http://MrMaksimize.com"
  };
}

// -- MSG Parsing Error messages -- //
exports.ERROR_MESSAGES = function() {
  return {
    invalid_request : "Ok... I'll be honest here, I dont know what that means ):",
    invalid_email : "Email doesn't look too good, maybe you should try it again.",
    invalid_phone : "Phone number doesn't look too good, maybe you should try it again."
  };
}

// -- Twilio Config -- //
exports.TWILIO_DATA = function() {
  return {
    number : "+13128001571",
    accountSid : "AC5a2be84ac3f138f11d48e040c7de698a",
    authToken : "7d71bcb8e36444fae06cdc335a16d74a"
  };
}

// -- Mandrill Config -- //
exports.MANDRILL_DATA = function() {
  return {
    key : "i2Pv1V3ydMdqKi-CgBexcQ"
  };
}

exports.EMAIL_RESUME = function() {
  var returnString = "Hey there! Looks like you wanted to see Maksim's Resume.  And here it is!  Enjoy the read! " + URLS.resumeURL;
  returnString += "\n Don't forget to check out his personal site as well - " + URLS.mrmSite;
  returnString += "\n Make sure you give him a call at 1.773.677.7755 or email him - maksim@maksimize.com";
  
  return returnString;
}
