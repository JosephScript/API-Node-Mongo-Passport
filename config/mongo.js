var mongoose = require('mongoose');

var mongoURI = "mongodb://localhost:27017/todoAPI";

module.exports = {
    init: function () {
        var MongoDB = mongoose.connect(mongoURI).connection;
        MongoDB.on('error', function (err) {
            if (err) {
                console.log('mongodb connection error', err);
            } else {
                console.log('mongodb connection successful');
            }
        });

        MongoDB.once('open', function () {
            console.log('mongodb connection open');
        });

    }
};