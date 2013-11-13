$(document).ready(function(){

  if (window.name=="ConnectWithLinkedIn") {
    window.close();
  }
  $('.login-link').click(function(event) {
    event.preventDefault();
    var path = '/user/auth';
    var windowName = 'ConnectWithLinkedIn'; // should not include space for IE
    var windowOptions = 'location=0,status=0,width=570,height=700,scrollbars=yes';
    var oauthWindow   = window.open(path, windowName, windowOptions);
    var oauthInterval = window.setInterval(function(){
      if (oauthWindow.closed) {
        window.clearInterval(oauthInterval);
        window.location = 'https://resutext.parseapp.com';
      }
    }, 1000);
  });
});

