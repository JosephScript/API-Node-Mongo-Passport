var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var ApiKey = require("../models/ApiKey.js");

router.get('/', stormpath.loginRequired, function(req, res) {

    var apiKeys = [];

    res.locals.user.getApiKeys(function(err, collectionResult) {
        if(collectionResult.items.length == 0) {
            res.locals.user.createApiKey(function(err, apiKey) {
                var apikey = new ApiKey(apiKey.id, apiKey.secret);
                apiKeys.push(apiKey);
                render(apiKeys);
            });
        }
        else {
            collectionResult.each(function(apiKey) {
                var apikey = new ApiKey(apiKey.id, apiKey.secret);
                apiKeys.push(apiKey);
                if (apiKeys.length === collectionResult.items.length) {
                    // Async... Now we're done!
                    render(apiKeys);
                }
            });
        }
    });

    var render =  function(data) {
        res.render('dashboard.ejs', {
            username: res.locals.user.username,
            apiKeys: data
        })
    };

});
console.log('dashboard loaded');

module.exports = router;
