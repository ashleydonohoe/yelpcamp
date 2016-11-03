var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    { 
        name: "Cloud's Rest", 
        image: "https://static.pexels.com/photos/30915/pexels-photo-30915-large.jpg", 
        description: "blah blah blah"
    }, 
    { 
        name: "Camp Cloudy", 
        image: "https://static.pexels.com/photos/127634/pexels-photo-127634-large.jpeg", 
        description: "blah blah blah"
    }, 
        { 
        name: "Starry Falls", 
        image: "https://static.pexels.com/photos/112378/pexels-photo-112378-large.jpeg", 
        description: "blah blah blah"
    }
];

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
         //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campground");
                    //create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
