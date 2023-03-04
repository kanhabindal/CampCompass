const express = require('express');
const session = require('express-session');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchasync.js');
const passport = require('passport');
const {isloggedin} = require('../middleware.js');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login)

router.get('/logout', users.logout)

module.exports = router;