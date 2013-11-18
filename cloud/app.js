
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var expressLayouts = require('cloud/express-layouts');
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var app = express();


// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(expressLayouts);          // Use the layout engine for express
app.use(parseExpressHttpsRedirect());    // Automatically redirect non-secure urls to secure ones
app.use(express.bodyParser());    // Middleware for reading request body

app.use(express.methodOverride());
app.use(express.cookieParser('SECRET_SIGNING_KEY'));
app.use(parseExpressCookieSession({
    fetchUser: true,
    key: 'image.sess',
    cookie: {
      maxAge: 3600000 * 24 * 30
    }
}));


app.locals._ = require('underscore');

// Custom middleware

//app.use(function(req, res, next) {
//  console.log(next);
//})



// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/', function(req, res) {

  if (!Parse.User.current()) {
    res.render('hello', { message: 'Welcome to ResuText!' });
  }
  else {
    var user = Parse.User.current();
    res.render('settings', {
      firstName: user.get('firstName') || '',
      lastName: user.get('lastName') || '',
      headline: user.get('headline') || '',
      linkedin: user.get('linkedin') || '',
    });
  }
});

app.get('/testing', function(req, res) {
  console.log('midware');
  next();
});
app.get('/testing/:op', function (req, res) {
  res.set({'Content-Type': 'application/json'});
  res.send({'test': 'ok'});
});


// User endpoints
app.use('/user', require('cloud/controllers/user'));

// Settings
app.use('/', require('cloud/settings'));

// Resume
app.use('/', require('cloud/resume'));

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
