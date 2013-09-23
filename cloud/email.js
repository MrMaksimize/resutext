
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
      to: message.to//[
        //{email: "you@parse.com", name: "Your Name"}
      //]
    },
    async: true
  },{
    success: function(httpResponse) {
      console.log(httpResponse);
      response.success("Email sent!");
    },
    error: function(httpResponse) {
      console.error(httpResponse);
      response.error("Uh oh, something went wrong");
    }
  });
}