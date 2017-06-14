var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');
var LocalStrategy   = require('passport-local').Strategy;

module.exports.signup = new LocalStrategy({passReqToCallback : true},
	function(req,username,password,done){
	  //console.log(username);
		// asynchronous
		// Profile.findOne wont fire unless data is sent back
		process.nextTick(function() {
		// find a profilewhose email is the same as the forms email
		// we are checking to see if the profile trying to login already exists
			Profile.findOne({ 'username' :  username }).then(profile => {
				console.log("dentro find profile: ", profile);
	              // Profile. found
				if(profile){
					return done(null, false);
				}else{
					// if there is no profile with that email
					// create the profile
					var newProfile = new Profile();
					newProfile.set('password', password);

					//console.log("pass: ", newProfile.password);
					//console.log("hashed: ", newProfile.hashed_password);
					// set the profile's local credentials
	  			newProfile.username   	= username;
	  			newProfile.displayName 	= req.body.displayName;
	  			newProfile.email    		= req.body.email;
	  			newProfile.name    		  = req.body.name;
	  			newProfile.provider    	= req.body.provider;
	  			newProfile.is_admin    	= req.body.is_admin;
					//newProfile.authToken  = req.body.provider;
	  			newProfile.profile_pic  = req.body.provider;
	  			newProfile.created    	= Date.now();
					// save the profile

					//console.log(newProfile);
					newProfile.save(function(err) {
						console.log("err:", err);
			    	if (err) throw err;
				   	return done(null, newProfile);
					});
				}
		  })
		  .catch(err => {
		    console.log("err---" + err);
		    err.toString();
		    return done(err);
		  });
		});
	});

module.exports.login = new LocalStrategy({passReqToCallback : true},
	function(req,username,password,done){
		// asynchronous
		// Profile.findOne wont fire unless data is sent back
		//console.log("username: ", username);
		//console.log("password: ", password);
		process.nextTick(function() {
			// find a profile whose email is the same as the forms email
			// we are checking to see if the profile trying to login already exists
			Profile.findOne({ 'username' :  username }).then(profile => {
				//console.log("profile: ", profile);
				if(!profile){
					return done(null, false);
				}
				if(!profile.validatePassword(password)){
					// if there is profile with that email, but password is wrong
					return done(null, false);
					// // create the loginMessage and save it to session as flashdata
				}
				 // all is well, return successful profile
				return done(null, profile);

  		}).catch(err => {
		    console.log("err---" + err);
		    err.toString();
		    return done(err);
		  });
		});
	});
