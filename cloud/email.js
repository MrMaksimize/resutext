
// -- Mandril Email Account -- //
var Mandrill = require('mandrill');
Mandrill.initialize('MwUpljIiBM9LpoFfk3YQrw');


exports.findEmailAddresses = function(StrObj) {
  var emailsArray = [];
  emailsArray = StrObj.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  return emailsArray;
}

exports.sendEmail = function(message) {
  console.log("Sending Message");
  console.log(message);
  Mandrill.sendEmail({
    message: {
      text: message.text,
      subject: message.subject,
      from_email: "no-reply@resutext.com",
      from_name: "ResuText",
      to: message.to
    },
    async: true
  },{
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email success");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Email Failed");
    }
  });
  return;
}