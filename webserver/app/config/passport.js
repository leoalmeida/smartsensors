var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');
var local = require('./passport/local');
//var google = require('./passport/google');
//var facebook = require('./passport/facebook');
//var twitter = require('./passport/twitter');
//var linkedin = require('./passport/linkedin');

module.exports = function(passport){
	/*
	passport session setup
	required for persistent login sessions
	passport needs ability to serialize and unserialize users out of session
	*/

	//used to serialize the user for the session
	passport.serializeUser(function(profile, done) {
		 done(null, profile.id)
	});

	//used to deserialize the user
	passport.deserializeUser(function(id, done) {
		Profile.findById(id, function (err, profile) {
			done(err, profile)
		})
	});


	// use these strategies
	passport.use('local-signup',local.signup);
  passport.use('local-login',local.login);

	//passport.use(google);
	//passport.use('facebook',facebook);
	//passport.use('twitter',twitter);
	//passport.use(linkedin);
};
