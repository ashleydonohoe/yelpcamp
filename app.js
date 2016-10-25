var express = require("express");
var app = express();
var campgrounds = [
    {
        name: "Happy Creek", image: "https://static.pexels.com/photos/27865/pexels-photo-27865-large.jpg"
    },
    {
        name: "Granite Creek", image: "https://static.pexels.com/photos/27679/pexels-photo-27679-large.jpg"
    },
    {
        name: "Rainy Falls", image: "https://static.pexels.com/photos/25540/pexels-photo-25540.jpg"
    }
    ];

app.set("view engine", "ejs");

app.get("/", function(req, res) {
   res.render("landing"); 
});

app.get("/campgrounds", function(req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server has started");
});