var express = require('express');
var router = express.Router();
var passport = require('passport');

/**
 * GET login
  */
router.get('/', function(req, res) {
    res.render('login.ejs')
});

/**
 * POST login
 */
router.post('/', function(req, res) {
    passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    })
});


console.log('login loaded');

module.exports = router;
