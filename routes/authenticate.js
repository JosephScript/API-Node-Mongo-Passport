var express = require('express');
var router = express.Router();
var passport = require('passport')


/** POST: Authenticate via API.
* Use passport.authenticate() as route middleware to authenticate the
* request.  If authentication fails, the user will be redirected back to the
* login page.  Otherwise, the primary route function function will be called,
* which, in this example, will redirect the user to the home page.
 */
router.post('/',
    passport.authenticate('localapikey', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
        res.json({ message: "Authenticated" })
    });


console.log('authenticate loaded');

module.exports = router;
