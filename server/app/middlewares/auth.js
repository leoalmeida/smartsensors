'use strict';

const AUTHORIZATION_MODEL = 'Basic';
const USER_PASS_SPLIT = ':';

var passport = require('passport');
var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');

module.exports = (req, res, next) => {
  if(!req.headers.authorization) {
    //console.log("Invalid Auth: ", req.headers.Authorization);
    return res.status(403).send();
  }

  let _b64UserName = req.headers.authorization.split(AUTHORIZATION_MODEL).pop().trim();
  let _arrayUserName = Buffer.from(_b64UserName, 'base64').toString('utf-8').split(USER_PASS_SPLIT);

  req.body.username = _arrayUserName[0];
  req.body.token = _arrayUserName[1];

  if (!req.body.token || !req.body.username){
    res.connectionMsg = { message: 'not-connected' };
    req.connectedStatus = false;
    return next();
  }

  Profile.findOne({ 'username' :  req.body.username }).then(profile => {
    if(!profile)
      return res.status(404).send({ message: 'invalid-credentials' });
    //console.log(Date.now());
    //console.log("Profile: ", profile);
    if (profile.token.value!==req.body.token || profile.token.expirationDate < Date.now())
        return res.status(404).send({ message: 'invalid-credentials' });

    //console.log(profile);
    req.body.password = profile.hashed_password;
    req.profile = profile;
    req.connectedStatus = true;
    return next();
  })
  .catch(err => {
    console.log("err---" + err);
    err.toString();
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
  //

  /*
  passport.authenticate('local-login', { username: req.username, password: req.password, session: false }, function(err, user, info) {
  	console.log("err: ", err);
  	console.log("info: ", info);
  	console.log("user: ", user);

  	console.log("username: ", req.username);

    if (err){
    	console.log("Auth error");
    	return res.status(403).send(req.getMessage(err));
    };

    if (!user) { return res.status(401).send("Custom Unauthorised").end(); }

    req.user = user;
    return next();
  })(req, res, next); //Login
  */
  /*User.authenticate({ uid: _arrayUserName[0], token: _arrayUserName[1] })
    .then(user => {
      req.user = user;
      return next();
    })
    .catch(err => {
      console.log("User Auth invalido");
      return res.status(403).send(req.getMessage(err));
    });*/
};
//qakPneDrG2qino1ln5BhXVEMv
//tQBwsjedD3jMbiwnGrvL2u9ywQxNvMGvtQg1dinzHVg8DvpBoJ
