var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET: Redirect Homepage to login page. */
router.get('/',
    passport.authenticate('local-api', { failureRedirect: '/login' }),
    function(req, res) {
        res.render('index.ejs', {
            user: user
        })
    });

console.log('index loaded');

module.exports = router;
