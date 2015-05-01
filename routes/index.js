var express = require('express');
var router = express.Router();

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

/**
 * GET: Redirect Homepage to login page.
 * */
router.get('/', isAuthenticated, function(req, res){
    res.render('index.ejs', { user: req.user });
});

console.log('index loaded');

module.exports = router;
