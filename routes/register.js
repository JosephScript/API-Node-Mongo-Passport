var express = require('express');
var router = express.Router();
var passport = require('passport');

/**
 *  GET: register
 * */
router.get('/',
    function(req, res, next) {
        res.render('register.ejs');
    });

/**
 * POST: register
 */
router.post('/',
    function(req, res, next) {
        passport.authenticate('local-register', {
            successRedirect: '/',
            failureRedirect: '/register',
            failureFlash : true,
            badRequestMessage: 'All fields are required.'
        })(req, res, next);
    });


console.log('register loaded');

module.exports = router;