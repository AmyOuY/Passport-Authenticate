var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User = require("./models/user"),
	app = express();

app.use(require("express-session")({
	secret: "Rust is the best ans cutest dog in the world",
	resave: false,
	saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/authDemoApp");



app.get("/", function(req, res){
	res.render("home");
});


app.get("/secret", isLoggedIn, function(req, res){
	res.render("secret");
});


// show sign up form
app.get("/register", function(req, res){
	res.render("register");
});


// handle user sign up
app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if (err){
			console.log(err);
			return res.render("register");
		}		
		passport.authenticate("local")(req, res, function(){
			res.redirect("/secret");
		});
		
	});
});


// render login form
app.get("/login", function(req, res){
	res.render("login");
});


// handle user login
app.post("/login", passport.authenticate("local", {
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res){
	
});


app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});


function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("The authentication server is running");
});
