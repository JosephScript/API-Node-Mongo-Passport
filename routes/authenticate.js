var express = require('express');
var router = express.Router();
var passport = require('passport')


/**
 * POST: Authenticate via API.
 */
router.post('/',
    passport.authenticate('localapikey', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
        res.json({ message: "Authenticated" })
    });


console.log('authenticate loaded');

module.exports = router;
