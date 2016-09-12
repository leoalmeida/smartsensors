'use strict';

const AUTHORIZATION_MODEL = 'Basic';
const USER_PASS_SPLIT = ':';
const User = require('../models/user-model');

module.exports = (req, res, next) => {

  console.log('Auth');

  if(!req.headers.authorization) {
    return res.status(403).send();
  }

  let _b64UserName = req.headers.authorization.split(AUTHORIZATION_MODEL).pop().trim();
  let _arrayUserName = Buffer.from(_b64UserName, 'base64').toString('utf-8').split(USER_PASS_SPLIT);
  console.log(_arrayUserName[0]);

  User.authenticate({ name: _arrayUserName[0], password: _arrayUserName[1] })
    .then(user => {
      console.log(user);
      req.user = user;
      return next();
    })
    .catch(err => {
      return res.status(403).send(err);
    });
};
