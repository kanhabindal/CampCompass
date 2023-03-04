const Campground = require('../models/campground');
const review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const reviewnew = new review(req.body.review);
    reviewnew.author = req.user._id;
    camp.reviews.push(reviewnew);
    await reviewnew.save();
    await camp.save();
    req.flash('success', 'Successfully added a new review!!');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteReview = async(req, res) => {
    const {id, review_id} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: review_id}});
    await review.findByIdAndDelete(review_id);
    req.flash('success', 'Successfully deleted a review!!');
    res.redirect(`/campgrounds/${id}`);
}