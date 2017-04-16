var express = require('express');
var router = express.Router();
var passport = require('passport');

module.exports = function(app){
  //var file  = app.controllers.fileController;

/* Router Calls */
  router.get('/', function(req, res) {
    res.render('index', { title: 'teste',path : '../web/src/' });
  });

  router.post('/users/create', passport.authenticate('local-signup', { successFlash: 'Welcome!' ,failureFlash: 'Invalid username or password.',successRedirect : '/profile',failureRedirect : '/signup', failureFlash : true  })); //Register
  /*app.post('/create',passport.authenticate('local-signup',{
                            successRedirect : '/profile', // redirect to the secure profile section
                            failureRedirect : '/signup', // redirect back to the signup page if there is an error
                            failureFlash : true // allow flash messages
                          }));*/

  router.post('/users/login', passport.authenticate('local-login',{
       successRedirect : '/profile', // redirect to the secure profile section
       failureRedirect : '/login', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages
    })); //Login

  // PROFILE SECTION we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  router.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user, // get the user out of session and pass to template
          title: "Kuwait Classified App",
          path : './',
          pp: 'hello pp',
          urlPath : '/profile'
    });
  });

  // LOGOUT
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
      return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
  }

  return router;

};
