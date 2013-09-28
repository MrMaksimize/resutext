
// -- Global Vars -- //
var global = require('cloud/globals.js');

// -- Mandril Email Account -- //
var Mandrill = require('mandrill');
Mandrill.initialize(global.MANDRILL_DATA().key);


exports.findEmailAddresses = function(StrObj) {
  var emailsArray = [];
  emailsArray = StrObj.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  return emailsArray;
}


// -- Public Email Constructor -- //

exports.makeEMAIL = function(from, to, subject, msg) {
  return new EMAIL(from,to,subject,msg);
}


// -- EMAIL OBJECT -- //

/*
 * EMAIL Object, includes:
 * - Sender
 * - Recipient
 * - Subject
 * - Message body
 */
function EMAIL(from,to,msg,subject)
{
  this.from = from;
  this.to = to;
  this.subject = msg;
  this.msg = msg;
}

EMAIL.prototype.send = function emailSend() {
  console.log("Sending " + this);
  
  Mandrill.sendEmail({
    message: {
      text: this.msg,
      subject: this.subject,
      from_email: this.from,
      from_name: "ResuText",
      to: [{ email: this.to }]
    },
    async: true
  },{
    success: function(httpResponse) {
      console.log('Email Sent');
      response.success('Email sent!');
    },
    error: function(httpResponse) {
      console.log('Email Failed');
      response.error('Email Failed');
    }
  });
}

EMAIL.prototype.get = function emailGet() {
  return { from: this.from, to: this.to, subject: subject, msg: this.msg };
}

EMAIL.prototype.toString = function emailToString() {
  return "EMAIL - From: " + this.from + ", to: " + this.to + ", subject: " + this.subject + ", message: " + this.msg;
}