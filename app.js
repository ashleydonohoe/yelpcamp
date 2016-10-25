var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
    {
        name: "Happy Creek", image: "https://static.pexels.com/photos/27865/pexels-photo-27865-large.jpg"
    },
    {
        name: "Granite Creek", image: "https://static.pexels.com/photos/27679/pexels-photo-27679-large.jpg"
    },
    {
        name: "Rainy Falls", image: "https://static.pexels.com/photos/25540/pexels-photo-25540.jpg"
    },
       {
        name: "Happy Creek", image: "https://static.pexels.com/photos/27865/pexels-photo-27865-large.jpg"
    },
    {
        name: "Granite Creek", image: "https://static.pexels.com/photos/27679/pexels-photo-27679-large.jpg"
    },
    {
        name: "Rainy Falls", image: "https://static.pexels.com/photos/25540/pexels-photo-25540.jpg"
    },
       {
        name: "Happy Creek", image: "https://static.pexels.com/photos/27865/pexels-photo-27865-large.jpg"
    },
    {
        name: "Granite Creek", image: "https://static.pexels.com/photos/27679/pexels-photo-27679-large.jpg"
    },
        {
        name: "Granite Creek", image: "https://static.pexels.com/photos/27679/pexels-photo-27679-large.jpg"
    }
    ];

app.set("view engine", "ejs");

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
    // get form data
    var name = req.body.name;
    var image = req.body.image;
    // add to campgrounds array
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started");
});