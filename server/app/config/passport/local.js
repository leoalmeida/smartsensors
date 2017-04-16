var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy   = require('passport-local').Strategy;

module.exports.signup = new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'inputUsername',
	passwordField : 'inputPassword',
	passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req,username,password,done){
		// asynchronous
		// User.findOne wont fire unless data is sent back
		     console.log("start signup");
		process.nextTick(function() {
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
            console.log("antes find");
			User.findOne({ 'local.user' :  username },function(err,user){
			    console.log("dentro find");
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
				}else{
					// if there is no user with that email
					// create the user
					var newUser            = new User();
					// set the user's local credentials
					newUser.local.user    = username;
					newUser.local.password = newUser.generateHash(password);
          newUser.displayName = username;//req.body.displayName;
					// save the user
					
					console.log(newUser);
					newUser.save(function(err) {
					     if (err) throw err;
						   return done(null, newUser);
					});
				}
			});
		});
	}
);

module.exports.login = new LocalStrategy({
	// by default, local strategy uses username and password, we will override with email
	usernameField : 'inputUsername',
	passwordField : 'inputPassword',
	passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req,username,password,done){
		// asynchronous
		// User.findOne wont fire unless data is sent back
		process.nextTick(function() {
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({ 'local.user' :  username },function(err,user){
				if(err)
					return done(err);
				//if no user is found, return the message
				if(!user){
					return done(null, false, req.flash('loginMessage', 'No user found.'));
				}
				if(!user.validPassword(password)){
					// if there is user with that email, but password is wrong
					return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 
					// // create the loginMessage and save it to session as flashdata
				}
				 // all is well, return successful user
				return done(null, user);
			});
		});
	}

	);
