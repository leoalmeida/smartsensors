'use strict';

const messages = require('../i18n/message-pt');

module.exports = (err,req,res,next) => {

  var err = new Error('Not Found');
  err.status = 404;

  err.messages = [];

  if (err.messageKeys){
    for (var i=0; i < err.messageKeys.length; i++){
      err.messages.push(req.getMessage(err.messageKeys[i]));
    }
  }

  if(err.messages.length === 0) {
    err.messages = [req.getMessage('unexpected-error')];
  }

  next(err);

  // console.log(err);
  //return res.status(err.code || 500).send(err);
};
