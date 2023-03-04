const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review.js')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_150');
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
	title: String,
	price: Number,
	description: String,
	location: String,
	images: [ImageSchema],
	geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
	reviews : [
		{type : Schema.Types.ObjectId, ref: 'review'}
	],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

campgroundSchema.post('findOneAndDelete', async(doc) => {
	if(doc) {
		await review.deleteMany({
			_id: { $in: doc.reviews }
		})
	}
})

module.exports = mongoose.model('Campground', campgroundSchema);