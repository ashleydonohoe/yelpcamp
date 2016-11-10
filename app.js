var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");


mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

// Passport Config
app.use(require("express-session")({
    secret: "Campgrounds are fun",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   next();
});

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           console.log(err);
       } else {
            res.render("comments/new", {campground: campground});
       }
    });
});

// Create new comment route
app.post("/campgrounds/:id/comments", isLoggedIn,  function(req, res) {
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

// ===========
// AUTH ROUTES
// ===========

// Show register form
app.get("/register", function(req, res) {
   res.render("register"); 
});

// Handle signup auth
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
           res.redirect("/campgrounds"); 
        });
    });
});

// Show login form
app.get("/login", function(req, res) {
   res.render("login"); 
});

// Handling login logic
app.post("/login", 
    passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), 
    function(req, res) {
         
});

// Handles logout
app.get("/logout", function(req, res) {
   req.logout();
   res.redirect("/campgrounds");
});

// Middleware for isLoggedIn
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Start server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started");
});