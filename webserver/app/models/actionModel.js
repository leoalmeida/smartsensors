'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ActionSchema = new Schema({
  equipmentID:{
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['start', 'stop', 'pause', 'update', 'message'],
    required: true
  },
  type: {
    type: String,
    enum: ['sensor', 'actuator', 'sink', 'recipe', 'all'],
    required: true
  },
  sync: {
    type: Date,
    default: Date.now()
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  }
})
//:type/:id/:action
ActionSchema.methods = {
  getLastUpdates: (equipmentID, lastSync) => {
    console.log("ActionModel getLastUpdates request");
    var expression = {};
    expression["equipmentID"] = mongoose.Types.ObjectId(equipmentID);
    expression["action"] = "update";
    if (lastSync) expression["sync"] = {$gt:lastSync};

    return Action.find(expression);
  },
  doEquipmentAction: (action) =>  {
    console.log("ActionModel doEquipmentAction request");
    return Action.create(action);
  }
}

mongoose.model('Action', ActionSchema);
