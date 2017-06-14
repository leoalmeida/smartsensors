'use strict'
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
const crypto = require('crypto');
const passportLocalMongoose = require('passport-local-mongoose');

// User schema
var Profile = new Schema({
   'name': { type: String, default: '' },
   'email': { type: String, validate: [validatePresenceOf, 'an email is required'], index: { unique: true } },
   'displayName': { type: String, default: '' },
   'username': { type: String, required: true, unique: true },
   'provider': { type: String, default: '' },
   'is_admin': { type: Boolean, default: false },
   'hashed_password': { type: String, required: true },
   'salt': { type: String, default: '' },
   'token': {
     'value': { type: String, default: '' },
     'requestDate' : { type: Number, default: Date.now() },
     'startDate' : { type: Number, default: Date.now() },
     'expirationDate' : { type: Number, default: Date.now() }
   },
   'key': { type: String, default: '' },
   'profile_pic': {type: String, default: 'blank-profile.png'},
   'created': { type: Date, default: Date.now }
}, {
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true
  }
});

function validatePresenceOf(value) {
  return value && value.length;
}


// Bcrypt middleware on UserSchema
Profile.pre('save', function(next) {
	var userProfile = this;

	if (!validatePresenceOf(userProfile.password)) {
	   next(new Error('Invalid password'));
	} else {
    next();
  }

	/*if (!userProfile.isModified('password')) return next();
	bcrypt.genSalt(config.env.SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(userProfile.password, salt, function(err, hash) {
        if (err) return next(err);
        userProfile.password = hash;
        next();
    });*/
});

Profile.virtual('password').set(function(password) {
   this._password = password;
   this.salt = this.makeSalt();
   this.hashed_password = this.encryptPassword(password);
}).get(function(){
   return this._password
});

var validatePresenceOf = function (value) {
   return value && value.length;
};

/* methods */
//Profile.methods = {
  //generating a hash
Profile.method('generateHash', function(password) {
	  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  });
  // checking if password is valid
Profile.method('comparePassword', function(password) {
	  return bcrypt.compareSync(password, this.local.password);
  });
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
Profile.method('authenticate', function (plainText) {
    return this.validatePassword(this.encryptPassword(plainText));
  });
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

Profile.method('makeSalt', function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

Profile.method('encryptPassword', function (password) {
    if (!password) return '';
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha256', this.salt).update(password).digest('hex');
      return encrypred;
    } catch (err) {
    	console.log("eerrr: ", err);
      return '';
    }
  });

  /**
   * Validation is not required if using OAuth
   */
  /*
  skipValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  }*/

Profile.method('validatePassword', function (password, callback) {
  return password === this.hashed_password;
});


  /**
   * Validation is not required if using OAuth
   */
  /*
  skipValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  }*/

//};


/* statics */
/*Profile.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
/*
  load: function (options, cb) {
    options.select = options.select || 'name username';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}
*/

//Profile.plugin(passportLocalMongoose);

mongoose.model('Profile', Profile);
