var passport = require('passport')
    , localStrategy = require('passport-local').Strategy
    , localStrategyAPI = require('passport-localapikey').Strategy
    , flash = require('connect-flash')
    , hat = require('hat')
    , User = require('../models/User.js');

module.exports = {
   init: function(app){

        // Initialize Passport.
        app.use(flash());
        app.use(passport.initialize());
        // Persistent login sessions.
        app.use(passport.session());

        // Configure flash. Requires cookie parser and session.
        app.use(flash());
        app.use(function(req, res, next) {
           res.locals.message = req.flash();
           next();
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
   }
};