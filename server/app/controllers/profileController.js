'use strict'

var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');
const ctrl = {};

ctrl.getProfile = (req, res) => {
  Profile.findOne({"username": req.body.username}, (err, profile) => {
    console.log("err" + err);
    if (err){
       return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
    }
    if (!profile) {
      return next({ data: err, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getAll request");
    profile.hashed_password="restricted";
    profile.salt="restricted";
    return res.status(200).json(profile);
  });
};

ctrl.changeProfilePassword = (req, res) => {
  Profile.findById(req.body.username, (err, profile) => {
      if (err) return res.status(400).send({ message: err });

      profile.validatePassword(req.password, (err) => {
        if (err) return res.status(400).send({ message: err });

        // password validation was ok
        profile.set('password', req.newPassword);

        profile.save((err) => {
          if (err) return res.status(400).send({ message: err });

          req.login(profile, function (err) {
             if (err) return res.status(400).send({ message: err });
             return res.status(201).json(profile);
          });
        });
      });
  });
};

ctrl.createProfile = (req, res) => {
  Profile.create(req.body)
    .then(data => {
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.updateProfile = (req, res) => {
  Profile.update(req.params.id, req.body)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};


ctrl.removeProfile = (req, res) => {
  Profile.remove(req.params.key)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};


module.exports = ctrl;
