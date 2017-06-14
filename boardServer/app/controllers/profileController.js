'use strict'

var uuid = require('node-uuid');
var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');

const ctrl = {};

ctrl.getProfile = (req, cb) => {
  Profile.findOne({"username": req.body.username}, (err, profile) => {
    console.log("err" + err);
    if (err){
      cb("err: internal");
    }
    if (!profile) {
      cb("err: not-found");
    }
    console.log("getAll request");
    profile.hashed_password="restricted";
    profile.salt="restricted";
    cb(profile)
  });
};

ctrl.createProfile = (req, cb) => {
    var requestdata = {};
    requestdata.username = req.username;
    requestdata.password = req.password;

    postOptions.json = true;

    var p = new Profile(req.body);
    p.key = uuid.v1();

    Profile.create(p)
      .then(resultdata => {
        console.log(resultdata);
        cb(resultdata);
      })
      .catch(err => {
        console.log(err);
        cb("err: not-found");
      });
};

ctrl.updateStatus = (req, cb) => {
  Profile.update({"_id": req.id},{"data.status": req.status})
  .then(resultdata => {
    console.log(resultdata);
    cb(resultdata);
  })
  .catch(err => {
    console.log(err);
    cb("err: not-found");
  });
};


ctrl.removeProfile = (req, cb) => {
  deleteOptions.path = '/user/' + req.username;
  console.log(deleteOptions.path);

  var deletedata = {};
  deletedata.username = req.username;
  Profile.remove(deletedata)
    .then(resultdata => {
      console.log(resultdata);
      cb(resultdata);
    })
    .catch(err => {
      console.log(err);
      cb("err: not-found");
    });
};


module.exports = ctrl;
