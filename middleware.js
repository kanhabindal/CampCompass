const Expresserror = require('./utils/Expresserror.js');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');


module.exports.isloggedin = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must signed in first');
		return res.redirect('/login');
	}
	next();
}

module.exports.validatecamp = (req, res, next) => {
	const {error} = campgroundSchema.validate(req.body);
	if(error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new Expresserror(msg, 400);
	}
	else {
		next();
	}
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, review_id } = req.params;
    const review = await Review.findById(review_id);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validreview = (req, res, next) => {
	const {error} = reviewSchema.validate(req.body);
	if(error) {
		const msg = error.details.map(el => el.message).join(',')
		throw new Expresserror(msg, 400);
	}
	else {
		next();
	}
}