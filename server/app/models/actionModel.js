'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ActionSchema = new Schema({
  action: {
    type: String,
    enum: ['start', 'stop', 'pause'],
    required: true
  },
  type: {
    type: String,
    enum: ['sensor', 'actuator', 'sink', 'all'],
    required: true
  },
  commands: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  }
})
//:type/:id/:action
ActionSchema.methods = {
  requestAction: (transaction) => {
    return Action.create(transaction);
  }
}

mongoose.model('Action', ActionSchema);
