'use strict'
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
// User schema
var UserSchema = new Schema({
   name: { type: String, default: '' },
   email: { type: String, default: '' },
   displayName: { type: String, default: '' },
   username: { type: String, required: true, unique: true },
   provider: { type: String, default: '' },
   is_admin: { type: Boolean, default: false },
   hashed_password: { type: String, required: true },
   salt: { type: String, default: '' },
   authToken: { type: String, default: '' },
   profile_pic: {type: String, default: 'blank-profile.png'},
   created: { type: Date, default: Date.now },
   local: {
       user: String,
       password: String
   }
});

// Bcrypt middleware on UserSchema
/*UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(config.env.SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();compare
    });
});
*/
UserSchema.virtual('password').set(function(password) {
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
UserSchema.methods = {
  //generating a hash
  generateHash: function(password) {
	  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  // checking if password is valid
  comparePassword: function(password) {
	  return bcrypt.compareSync(password, this.local.password);
  },
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred;
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */
  /*
  skipValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  }*/
};


/* statics */
UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name username';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}

mongoose.model('User', UserSchema);
/*
const db = require('../db');

const model = {};

model.authenticate = (user) => {

  return new Promise((resolve, reject) => {
    db.ref("users/" + user.uid)
        .once("value", data => {
            let value = data.val();
            if (value.token.value && value.token.value != null && value.token.value === user.token && Date.now() <= value.token.expireDate){
                return resolve(value);
            }
            return reject('invalid-token');
        },err => {
            return reject(err);
        });
  });
}

module.exports = model;
*/
