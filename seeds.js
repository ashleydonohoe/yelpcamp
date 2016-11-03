var mongoose = require('mongoose');
var Campground = require("./models/campground");

Campground.remove({}, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("Removed campgrounds"); 
    }
});