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
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
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
        console.log('credentials passed to passport local-api: ' + apiKey);

        // check in mongo if a user with apiKey exists or not
        User.findOne(
            { 'apiKey' :  apiKey },
            function(err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // Apikey does not exist, log error & redirect back
                if (!user){
                    console.log('User Not Found with apiKey '+ apikey);
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
        console.log('credentials passed to passport local-login: ' + email + ' ' + password);
        // check in mongo if a user with email exists or not
        User.findOne({ 'email' :  email },
            function(err, user) {
                // In case of any error, return using the done method
                if (err)
                    return done(err);
                // email does not exist, log error & redirect back
                if (!user){
                    console.log('User Not Found with email '+ email);
                    return done(null, false,
                        req.flash('error', 'User Not found.'));
                }
                // User exists but wrong password, log the error
                if (!isValidPassword(user, password)){
                    console.log('Invalid Password');
                    return done(null, false,
                        req.flash('error', 'Invalid Password'));
                }
                // User and password both match, return user from
                // done method which will be treated like success
                return done(null, user);
            }
        );
    }));

// Use the LocalStrategy within Passport to register users
passport.use('local-register', new localStrategy({
            passReqToCallback : true,
            usernameField: 'email'
        },
        function(req, email, password, done) {
            console.log('credentials passed to passport local-register :' + email + ' ' + password);
            findOrCreateUser = function () {
                // find a user in Mongo with provided email
                User.findOne({'email': email}, function (err, user) {
                    // In case of any error return
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists');
                        return done(null, false,
                            req.flash('error', 'User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        newUser.password = req.params.password;
                        newUser.email = email;
                        newUser.firstName = req.params.firstName;
                        newUser.lastName = req.param.lastName;
                        newUser.apiKey = hat();
                        // save the user
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
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
