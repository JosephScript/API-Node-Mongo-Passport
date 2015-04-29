var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');

router.get('/', stormpath.loginRequired, function(req, res) {

    console.log('User ' + req.user.email + ' just accessed the /dashboard page!');

    var userKeys = [];

    // check if user has any keys
    req.user.getApiKeys(function(err, keys) {
        if (err) throw err;
        keys.each(function (key) {
            userKeys.push(key);
        });
    });

    // if not, create one
    if(userKeys.length == 0) {
        req.user.createApiKey(function (err, key) {
            if (err) throw err;
            userKeys.push(key);
        });
    }

    // send the user their keys
    res.json(userKeys);
});
// username - The user’s unique username (defaults to email).
// email - The user’s unique email address.
// givenName - The user’s first name.
// surname - The user’s last name.
// middleName - The user’s middle name.
// customData - A JSON blob of custom user data. NOTE: This is a special property.

console.log('dashboard loaded');

module.exports = router;
