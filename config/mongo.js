var mongoose = require('mongoose')

var mongoURI = "mongodb://localhost:27017/todoAPI"

module.exports = {
    init: function () {
      const promise = mongoose.connect(mongoURI)
  
      promise.then(function (db) {
        console.log('mongodb connection open')
      })
    }
};