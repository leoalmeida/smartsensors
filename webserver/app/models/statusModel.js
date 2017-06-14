'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const StatusSchema = new Schema({
  knowledge: {
    type: String,
    required: true
  },
  key: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['first', 'general'],
    required: true
  },
  type: {
    type: String,
    enum: ['sensor', 'actuator', 'sink'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  }
})

StatusSchema.methods = {
  sendStatus: (transaction) => {
    return Status.create(transaction);
  }
}

mongoose.model('Status', StatusSchema);
