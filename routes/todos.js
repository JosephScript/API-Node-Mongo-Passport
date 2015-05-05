var express = require('express')
, router = express.Router()
, mongoose = require('mongoose')
, Todo = require('../models/Todo.js')
, auth = require('../libs/auth');

/* GET /todos listing. */
router.get('/', auth.IsApiAuthenticated, function(req, res, next) {
  Todo.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', auth.IsApiAuthenticated, function(req, res, next) {
  Todo.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', auth.IsApiAuthenticated, function(req, res, next) {
  Todo.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', auth.IsApiAuthenticated, function(req, res, next) {
  Todo.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /todos/:id */
router.delete('/:id', auth.IsApiAuthenticated, function(req, res, next) {
  Todo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

console.log('todos loaded');

module.exports = router;