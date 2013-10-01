
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



// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

// User endpoints
app.use('/', require('cloud/user'));

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
