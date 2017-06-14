'use strict';

const AUTHORIZATION_MODEL = 'Basic';
const USER_PASS_SPLIT = ':';

var passport = require('passport');
var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');

var request = require("request");
var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzOWRhOTNjZi01YmMxLTRmZWYtYWE5Mi02MDkxODhkNGU2ZDMifQ.2fOWOPw8DsNkssI9OQUAuJ0TzBFaOxq_fIbD02AIfew'

module.exports = (req, res, next) => {
  if(!req.headers.authorization) {
    //console.log("Invalid Auth: ", req.headers.Authorization);
    return res.status(403).send();
    //res.connectionMsg = { message: 'not-connected' };
    //req.connectedStatus = false;
    //return next();
  }

  let _b64UserName = req.headers.authorization.split(AUTHORIZATION_MODEL).pop().trim();
  let _arrayUserName = Buffer.from(_b64UserName, 'base64').toString('utf-8').split(USER_PASS_SPLIT);

  if (!_arrayUserName[0] || !_arrayUserName[1]){
    res.connectionMsg = { message: 'not-connected' };
    req.connectedStatus = false;
    return next();
  };

  req.params.username = _arrayUserName[0];
  req.params.token = _arrayUserName[1];

  var options = {
    method: 'GET',
    url: 'https://api.ionic.io/auth/users/' + req.params.username,
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  };

  request(options, function(err, response, profile) {
    if (err) throw new Error(err);
    //console.log("profile: ",profile);
    if(!profile)
      return res.status(404).send({ message: 'invalid-credentials' });
    var metadata = JSON.parse(profile);
    if (metadata.meta.status !== 200)
        return res.status(metadata.meta.status).send(metadata.error);

    if (metadata.data.app_id !== "734dd7bf" || metadata.data.details.password !== req.params.password)
      return res.status(404).send({ message: 'invalid-credentials' });
    /*if (profile.token.value!==req.params.token || profile.token.expirationDate < Date.now())
        return res.status(404).send({ message: 'invalid-credentials' });
*/
    //console.log(profile);
    //req.body.username = profile.data.details.uuid;
    //req.body.password = profile.hashed_password;
    req.profile = metadata.data;
    req.connectedStatus = true;
    return next();

    });

  /*Profile.findOne({ 'username' :  req.params.username }).then(profile => {
    console.log(profile);
    if(!profile)
      return res.status(404).send({ message: 'invalid-credentials' });

    if (profile.token.value!==req.params.token || profile.token.expirationDate < Date.now())
        return res.status(404).send({ message: 'invalid-credentials' });

    //console.log(profile);
    req.body.username = profile.username;
    req.body.password = profile.hashed_password;
    req.profile = profile;
    req.connectedStatus = true;
    return next();
  })
  .catch(err => {
    console.log("err---" + err);
    err.toString();
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });*/
};
//qakPneDrG2qino1ln5BhXVEMv
//tQBwsjedD3jMbiwnGrvL2u9ywQxNvMGvtQg1dinzHVg8DvpBoJ
