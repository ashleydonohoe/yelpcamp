var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// Show all campgrounds route
router.get("/", function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            // Show campgrounds
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});
// Add campground route
router.post("/", function(req, res) {
    // get form data
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description: description};
    Campground.create(newCampground, function(err, newCampground) {
       if(err) {
           console.log(err);
       } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
       }
    });
});

// Show new campground form route
router.get("/new", function(req, res) {
   res.render("campgrounds/new"); 
});

// Campground show route
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        console.log(foundCampground);
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;