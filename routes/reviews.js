const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require("mongoose");
// const mongo = require('../models/mongo.js')
const Campground = require('../models/campground.js');
const catchasync = require('../utils/catchasync.js');
const Expresserror = require('../utils/Expresserror.js');
const {campgroundSchema, reviewSchema} = require('../schemas.js');
const review = require('../models/review.js');
const {isloggedin, isAuthor, validreview, isReviewAuthor} = require('../middleware.js');
const reviews = require('../controllers/reviews');



router.post('/', isloggedin, validreview, catchasync(reviews.createReview))

router.delete('/:review_id', isloggedin, isReviewAuthor, catchasync(reviews.deleteReview))

module.exports = router;