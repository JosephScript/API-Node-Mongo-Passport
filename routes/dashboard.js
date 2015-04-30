var express = require('express');
var router = express.Router();
var User = require("../models/User.js");

router.get('/', function(req, res) {

    var render =  function(data) {
        res.render('dashboard.ejs', {
            username: res.locals.user.username,
            apiKeys: data
        })
    };

});
console.log('dashboard loaded');

module.exports = router;
