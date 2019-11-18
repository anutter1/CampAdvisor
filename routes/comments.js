var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments/new
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});	
		}
	})
	
});


//comments create
router.post("/", middleware.isLoggedIn, function(req, res){
	//look up campground
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong!");
					res.redirect("/campgrounds");
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment added successfully");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//Edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Cannot find Campground");
			return res.redirect("back");
			}
			Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
			req.flash("error", "oops soemthing went wrong");
			res.redirect("back");
			} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});

//Update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", "Comment not found")
			res.redirect("back")
		} else {
			req.flash("success", "Comment successfully updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Comment delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;