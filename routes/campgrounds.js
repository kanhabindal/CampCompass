const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Campground = require('../models/campground.js');
const mongo = require('../models/mongo.js')
const ejsMate = require('ejs-mate');
const catchAsync = require('../utils/catchasync.js');
const {isloggedin, isAuthor, validatecamp} = require('../middleware.js');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isloggedin, upload.array('image'), validatecamp, catchAsync(campgrounds.createCampground))
    

router.get('/new', isloggedin, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isloggedin, isAuthor, upload.array('image'), validatecamp, catchAsync(campgrounds.updateCampground))
    .delete(isloggedin, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isloggedin, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;