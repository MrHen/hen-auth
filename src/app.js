var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
var jwt = require('express-jwt');
var cors = require('cors');
var http = require('http');

var routes = require('./api/routes/index');
var users = require('./api/routes/users');

var app = express();
var router = express.Router();

dotenv
  .config({
    silent: true
  });

var authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'api', 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use('/api/', routes);
app.use('/api/users', users);
app.use('/api/secured', authenticate);
app.use('/api/scoped', authenticate);
app.use('/api/scoped', function(req, res, next) {
  if (!req.user || !req.user.app_metadata) {
    return res.status(403).send("No app_metadata.");
  }

  if (req.user.app_metadata.test !== "test") {
    return res.status(403).send("Missing claim.");
  }

  next();
});

app.get('/api/ping', function(req, res) {
  res.send("All good. You don't need to be authenticated to call this");
});

app.get('/api/secured/ping', function(req, res) {
  res.status(200).send(
    "All good. You only get this message if you're authenticated");
});

app.get('/api/scoped/ping', function(req, res) {
  res.status(200).send(
    "All good. You only get this message if you're scoped");
});

app.use('/bower_components', express.static(path.join(__dirname,
  'bower_components')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'sample')));

module.exports = app;
