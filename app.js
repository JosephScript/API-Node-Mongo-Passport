var express = require('express')
    , path = require('path')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , passport = require('passport')
    , localStrategy = require('passport-localapikey').Strategy
    , mongoose = require('mongoose');

var routes = require('./routes/index')
    , todos = require('./routes/todos')
    , dashboard = require('./routes/dashboard')
    , authenticate = require('./routes/authenticate')
    , login = require('./routes/login')
    , logout = require('./routes/logout');


// SET UP MONGO
var mongoURI = "mongodb://localhost:27017/todoAPI";
var MongoDB = mongoose.connect(mongoURI).connection;
MongoDB.on('error', function(err) {
    if(err) {
        console.log('mongodb connection error', err);
    } else {
        console.log('mongodb connection successful');
    }
});
MongoDB.once('open', function() {
    console.log('mongodb connection open');
});

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport to authenticate apis
passport.use("local-api", new localStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(apikey, done) {
        funct.localAuth(apikey)
            .then(function (user) {
                if (!user) {
                    return done(null, false, {message: 'Unknown apikey : ' + apikey});
                }
                // if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
                return done(null, user);
            })
            .fail(function (err){
                    return done(err);
            });
    }
));

// Use the LocalStrategy within Passport to login users
passport.use('local-login', new localStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localAuth(username, password)
            .then(function (user) {
                if (user) {
                    console.log("LOGGED IN AS: " + user.username);
                    req.session.success = 'You are successfully logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT LOG IN");
                    req.session.error = 'Could not log user in. Please try again.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err){
                return done(err);
            });
    }
));
// Use the LocalStrategy within Passport to register users
passport.use('local-register', new localStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        funct.localReg(username, password)
            .then(function (user) {
                if (user) {
                    console.log("REGISTERED: " + user.username);
                    req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
                    done(null, user);
                }
                if (!user) {
                    console.log("COULD NOT REGISTER");
                    req.session.error = 'That username is already in use, please try a different one.'; //inform user could not log them in
                    done(null, user);
                }
            })
            .fail(function (err) {
                return done(err);
            });

    }
));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/todos', todos);
app.use('/dashboard', dashboard);
app.use('/authenticate', authenticate);
app.use('/login', login);
app.use('/logout', logout);

app.use(express.static(__dirname + '/public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
