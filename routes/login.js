var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET: login via API. */
router.get('/', function(req, res, next) {
    res.render('login.ejs')
});

router.post('/', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) { return next(err); }
        if(!user){
             return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/');
        });
    })(req, res, next);
});

console.log('login loaded');

module.exports = router;
