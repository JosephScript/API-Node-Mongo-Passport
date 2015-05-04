var express = require('express');
var router = express.Router();
var passport = require('passport')


/**
 * POST: Authenticate via API.
 */
router.post('/', function(req, res, next) {
    passport.authenticate('local-api', {
        failureRedirect: '/login',
        failureFlash : true
    })(req, res, next);
    res.json({ message: "Authenticated" })
});

console.log('authenticate loaded');

module.exports = router;
