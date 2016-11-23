var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var methodOverride = require("method-override");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");


// Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");


// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://ashley:]VhzYDexPpgeUNCoofsz9BWp@ds163397.mlab.com:63397/yelpcamp");
//mongodb://ashley:]VhzYDexPpgeUNCoofsz9BWp@ds163397.mlab.com:63397/yelpcamp
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// seedDB();

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

app.use("/", authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

// Start server
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started");
});