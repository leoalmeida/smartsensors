'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const LogSchema = new Schema({
  sync: {
    type: Date,
    default: Date.now()
  },
  message: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  }
})
//:type/:id/:action
LogSchema.methods = {
  createLog: (message) =>{
      let log = {
          msg: message,
          sync: Date.now()
      }
      return Logs.create(log);
  }
};

mongoose.model('Log', LogSchema);
