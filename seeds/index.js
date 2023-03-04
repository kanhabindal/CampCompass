const cities = require('./in.js');
const {places, descriptors} = require('./seedHelpers.js');
const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const mongo = require('../models/mongo.js')

const sample = array => array[Math.floor(Math.random() * array.length)];
const ranprice = () => Math.floor(Math.random() * 500) + 200;

const seeddb = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 250; i++) {
		const randomnum = Math.floor(Math.random() * 406);
		const nayi_jagah = new Campground ({
			author: '63c52b5f88c6939e18a6cc39',
			location: `${cities[randomnum].city}, ${cities[randomnum].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			geometry: {
                type: "Point",
                coordinates: [
                	cities[randomnum].longitude,
                	cities[randomnum].latitude ]
            },
			images: [
    			{
                	url: 'https://res.cloudinary.com/dxu9coiey/image/upload/v1674020403/YelpCamp/vxo02mlsqpmbdizqssyq.jpg',
                	filename: 'YelpCamp/vxo02mlsqpmbdizqssyq'
                },
                {
                	url: 'https://res.cloudinary.com/dxu9coiey/image/upload/v1674020403/YelpCamp/qmmvqajblkien6ojnyw2.jpg',
                	filename: 'YelpCamp/qmmvqajblkien6ojnyw2'
                }
            ],
			price: ranprice(),
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		})
		await nayi_jagah.save();
	}
}


seeddb();
mongo();
