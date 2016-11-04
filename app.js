var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

// Landing page route
app.get("/", function(req, res) {
   res.render("landing"); 
});

// Show all campgrounds route

app.get("/campgrounds", function(req, res) {
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
app.post("/campgrounds", function(req, res) {
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
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new"); 
});

// Campground show route
app.get("/campgrounds/:id", function(req, res){
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
})

//
// ===============
// Comments Routes
// ================
//

// New campground form route
app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
       } else {
            res.render("comments/new", {campground: campground});
       }
    });
});

// Create new comment route
app.post("/campgrounds/:id/comments", function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
      if(err) {
          console.log(err);
          res.redirect("/campgrounds");
      } else {
        Comment.create(req.body.comment, function(err, comment) {
           if(err) {
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect("/campgrounds/" + campground._id);
           }
        });
      }
   });
});

// Start server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started");
});