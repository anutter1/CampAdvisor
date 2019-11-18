var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res){
	res.render("landing");
});


//=============
//AUTH ROUTES
//=============
//register

router.get("/register", function(req, res){
	res.render("register", {page: "register"});
});

//Handle Sign Up Logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === "Sockpuppet99"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
			if(err){
    		return res.render("register", {error: err.message});
}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to CampAdvisor " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//Login
router.get("/login", function(req, res){
	res.render("login", {page: "login"});
});

//Login Logic
router.post("/login", passport.authenticate("local",
	{
	 successRedirect: "/campgrounds",
	 failureRedirect: "/login"
	}), function(req, res){
});

//Log Out
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/campgrounds");
});


module.exports = router;
