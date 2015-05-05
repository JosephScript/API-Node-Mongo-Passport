var express = require('express')
    , session = require('express-session')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , path = require('path')
    , favicon = require('serve-favicon')
    , logger = require('morgan')
    , passport = require('passport')
    , localStrategy = require('passport-local').Strategy
    , localStrategyAPI = require('passport-localapikey').Strategy
    , mongoose = require('mongoose')
    , hat = require('hat')
    , User = require('./models/User.js')
    , flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000, secure: false },
    resave: true,
    saveUninitialized: false
}));
app.use(flash());

// Initialize Passport.
app.use(passport.initialize());
// Persistent login sessions.
app.use(passport.session());

// Configure flash. Requires cookie parser and session.
app.use(flash());
app.use(function(req, res, next) {
    res.locals.message = req.flash();
    next();
});

// Mongo setup
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

// Passport session setup
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport to authenticate apis
passport.use('local-api', new localStrategyAPI(
    {
        passReqToCallback : true
    },
    function(req, apiKey, done) {

        // check in mongo if a user with apiKey exists or not
        User.findOne({ 'apiKey' :  apiKey },
            function(err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Apikey does not exist, log error & redirect back
                if (!user){
                    return done(null, false,
                        req.flash('message', 'Unknown apiKey: ' + apikey));
                }

                // Correct API Key
                return done(null, user);
            }
        )}
));

// Use the LocalStrategy within Passport to login users
passport.use('local-login', new localStrategy({
        passReqToCallback : true,
        usernameField: 'email'
    },
    function(req, email, password, done) {
        User.getAuthenticated(email, password, function(err, user, reason){
            // In case of any error, return using the done method
            if (err) throw err;

            // login was successful if we have a user
            if (user) {
                // handle login success
                console.log('login success');
                return done(null, user);
            }

            // otherwise we can determine why we failed
            var reasons = User.failedLogin;
            switch (reason) {
                case reasons.NOT_FOUND:
                case reasons.PASSWORD_INCORRECT:
                    // note: these cases are usually treated the same - don't tell
                    // the user *why* the login failed, only that it did
                    return done(null, false,
                        req.flash('error', 'Incorrect Email and Password.'));
                    break;
                case reasons.MAX_ATTEMPTS:
                    // send email or otherwise notify user that account is
                    // temporarily locked
                    return done(null, false,
                        req.flash('error', 'Account has been temporarily locked.'));
                    break;
            }
        });
    }));

// Use the LocalStrategy within Passport to register users
passport.use('local-register', new localStrategy({
            passReqToCallback : true,
            usernameField: 'email'
        },
        function(req, email, password, done) {
            findOrCreateUser = function () {
                // find a user in Mongo with provided email
                User.findOne({'email': email}, function (err, user) {
                    // In case of any error return
                    if (err) {
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        return done(null, false,
                            req.flash('error', 'User Already Exists'));
                    } else {

                        if (req.body.password != req.body.confirm) {
                            done(null, false,
                                req.flash('error', 'Passwords do not match.'));
                        }
                        // if there is no user with that email
                        // create the user
                        var newUser = new User({
                            password: req.body.password,
                            email: email,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            apiKey: hat(),
                            created_at: Date.now()
                        });

                        // save the user
                        newUser.save(function (err) {
                            // In case of any error, return using the done method
                            if (err) {
                                return done(err);
                            }
                            // User Registration succesful
                            return done(null, newUser);
                        });
                    }
                });
            };

            // Delay the execution of findOrCreateUser and execute
            // the method in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
);


// Set up routing
var routes = require('./routes/index')
    , todos = require('./routes/todos')
    , register = require('./routes/register')
    , authenticate = require('./routes/authenticate')
    , login = require('./routes/login')
    , logout = require('./routes/logout');

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/todos', todos);
app.use('/authenticate', authenticate);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);

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
