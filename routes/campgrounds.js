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
router.post("/", isLoggedIn, function(req, res) {
    // get form data
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};
    console.log(req.user);
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
router.get("/new", isLoggedIn, function(req, res) {
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

// Show edit campground form
router.get("/:id/edit", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            res.redirecy("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// Put updated campground info
router.put("/:id", function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
      if(err) {
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// Delete campground route

// Middleware for isLoggedIn
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = router;