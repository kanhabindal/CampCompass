const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const Campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", {Campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new.ejs");
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newcamp = new Campground(req.body.campground);
    newcamp.geometry = geoData.body.features[0].geometry;
    newcamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newcamp.author = req.user._id;
    await newcamp.save();
    console.log(newcamp);
    req.flash('success', 'You have made a new campground!!');
    res.redirect(`/campgrounds/${newcamp._id}`); 
}

module.exports.showCampground = async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({path: 'reviews', populate : {path: 'author'}}).populate('author');
    if(!camp){
        req.flash('error', 'Cannot find campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show.ejs", {campground : camp});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit.ejs", {campground});
}

module.exports.updateCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const {id} = req.params;
    const edited = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    edited.geometry = geoData.body.features[0].geometry;
    console.log(edited.geometry);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    edited.images.push(...imgs);
    await edited.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await edited.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!!');
    res.redirect(`/campgrounds/${edited._id}`);
}

module.exports.deleteCampground = async(req, res) => {
    const {id} = req.params;
    const edited = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!!');
    res.redirect(`/campgrounds`);
}