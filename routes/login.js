const express = require('express')
const router = express.Router()
const passport = require('passport')

/**
 * GET login
  */
router.get('/', function (req, res, next) {
  res.render('login.ejs')
})

/**
 * POST login
 */
router.post('/', function (req, res, next) {
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
})


console.log('login loaded')

module.exports = router
