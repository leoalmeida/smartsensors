'use strict';

const AUTHORIZATION_MODEL = 'Basic';
const USER_PASS_SPLIT = ':';
const User = require('../models/userModel');

module.exports = (req, res, next) => {
console.log(req);
  if(!req.headers.Authorization) {
    return res.status(403).send();
  }

  let _b64UserName = req.headers.Authorization.split(AUTHORIZATION_MODEL).pop().trim();
  let _arrayUserName = Buffer.from(_b64UserName, 'base64').toString('utf-8').split(USER_PASS_SPLIT);
  console.log(_arrayUserName[0]);

  User.authenticate({ uid: _arrayUserName[0], token: _arrayUserName[1] })
    .then(user => {
      req.user = user;
      return next();
    })
    .catch(err => {
      return res.status(403).send(req.getMessage(err));
    });
};
