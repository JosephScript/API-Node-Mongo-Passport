var express = require('express');
var router = express.Router();

/* GET: login via API. */
router.get('/', function(req, res, next) {
    res.render('login.ejs')
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/users/' + user.username);
        });
    })(req, res, next);
});

console.log('login loaded');

module.exports = router;
