var express = require('express')
, router = express.Router();

router.get('/logout',
    function(req, res, next){
        req.logout();
        res.redirect('/');
});

console.log('logout loaded');

module.exports = router;
