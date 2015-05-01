var express = require('express');
var router = express.Router();
var passport = require('passport');

/**
 *  GET: register
 * */
router.get('/',
    function(req, res) {
        res.render('register.ejs')
    });

/**
 * POST: register
 */
router.post('/', passport.authenticate('local-register', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash : true
}));


console.log('register loaded');

module.exports = router;