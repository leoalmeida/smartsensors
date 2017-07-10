'use strict'

var uuid = require('node-uuid');
const https = require('https');

var postOptions = {
  host: 'api.cloudmqtt.com',
  port: 443,
  path: '/user',
  headers: {
    'Content-Type': 'application/json'
  },
  auth: 'dqzvavul:gtldwTV1VItA',
  method: 'POST'
};

var deleteOptions = {
  host: 'api.cloudmqtt.com',
  port: 443,
  auth: 'dqzvavul:gtldwTV1VItA',
  method: 'DELETE'
};

var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');
var Knowledge = mongoose.model('Knowledge');
const ctrl = {};

ctrl.getProfile = (req, res, next) => {
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

ctrl.createProfile = (req, res, next) => {
    var requestdata = {};
    requestdata.username = req.body.username;
    requestdata.password = req.body.password;

    postOptions.json = true;

    var request = https.request(postOptions, (response) => {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('BODY: ' + JSON.stringify(chunk));
      });

      var p = new Profile(req.body);
      p.key = uuid.v1();

      Profile.create(p)
        .then(resultdata => {
          //return res.status(201).send(resultdata);
          //next({data: resultdata, code: 201});
          req.params.type = "object";
          req.params.subtype = "profile";
          req.params.owner = resultdata.key;
          req.params.relations = {"abstractions" : [],"elements" : []};
          next();
        })
        .catch(err => {
          return res.status(400).send(err);
        });
    });

    request.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      return res.status(400).send(e.message);
    });
    request.write(JSON.stringify(requestdata));
    request.end();
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


ctrl.removeProfile = (req, res, next) => {

  deleteOptions.path = '/user/' + req.params.username;
  console.log(deleteOptions.path);

  var requestdel = https.request(deleteOptions, (response) => {
    console.log('STATUSDEL: ' + response.statusCode);
    console.log('HEADERSDEL: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log('BODYDEL: ' +  JSON.stringify(chunk));
    });

    var deletedata = {};
    deletedata.username = req.params.username;
    Profile.remove(deletedata)
      .then(resultdata => {
        //return res.status(200).json(resultdata);
        //next({data: resultdata, code: 200});
        req.params.type = "object";
        req.params.subtype = "profile";
        req.params.username = req.params.username;
        req.params.relations = {"abstractions" : [],"elements" : []};
        next();
      })
      .catch(err => {
        return res.status(400).send(err);
      });

  });

  requestdel.on('error', (e) => {
    console.error(`problem with request delete: ${e.message}`);
    return res.status(400).send(e.message);
  });
  requestdel.end();
};


module.exports = ctrl;
