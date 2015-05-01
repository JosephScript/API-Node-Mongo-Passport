var express = require('express');
var router = express.Router();
var passport = require('passport')


/**
 * POST: Authenticate via API.
 */
router.post('/', function(req, res) {
    passport.authenticate('local-api', {
        failureRedirect: '/login',
        failureFlash : true
    })
    res.json({ message: "Authenticated" })
});

console.log('authenticate loaded');

module.exports = router;
