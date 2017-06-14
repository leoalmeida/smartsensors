'use strict'
var passport = require('passport');

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.profileController;
  const ctrlkng = app.controllers.knowledgeController;
  /*router.post('/register', function(req, res, next) {
    passport.authenticate('local-signup', { session: false }, function(err, profile, info) {
      console.log('registering user');
      console.log("user: ", profile);
      console.log("err: ", err);

      if (err){
        console.log("Auth error");
        return res.status(403).send(req.getMessage(err));
      };

      if (!profile) { return res.status(401).send("Custom Unauthorised").end(); }

      console.log('user registered!');
      return res.status(200).send(profile);
    })(req, res, next);
  });
*/
  router.put('/', ctrl.createProfile, ctrlkng.createKnowledge);
  router.get('/', passport.authenticate('local-login'), ctrl.getProfile);
  router.post('/:id', ctrl.updateProfile);
  router.delete('/:username', ctrl.removeProfile, ctrlkng.removeProfile);
  router.post('/:id', passport.authenticate('local-login'), ctrl.changeProfilePassword);
  return router;
};
