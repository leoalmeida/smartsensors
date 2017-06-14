'use strict'

const mongoose = require('mongoose');
const MessengerSchema = new mongoose.Schema({
  root: {
    type: String,
    required: true
  },
  access: {
    type: String,
    default: "public",
    trim: true
  },
  relations: {
    abstraction : { type: Boolean, default: false},
    parent : { type: String, default: "", trim: true },
    ownedBy : [{
         id: mongoose.Schema.Types.ObjectId,
         sync: { type: Number, default: Date.now()},
         access: { type: String, default: "public"},
         publish: { type: Boolean, default: false},
         view: { type: Boolean, default: false}
     }],
    connectedTo : [{
         id: mongoose.Schema.Types.ObjectId,
         sync: { type: Number, default: Date.now()},
         access: { type: String, default: "public"},
         publish: { type: Boolean, default: false},
         view: { type: Boolean, default: false}
     }],
    subscriberAt : [{
      id: mongoose.Schema.Types.ObjectId,
      sync: { type: Number, default: Date.now()},
      access: { type: String, default: "public"},
      publish: { type: Boolean, default: false},
      view: { type: Boolean, default: false}
     }],
    likedTo : [{
      id: mongoose.Schema.Types.ObjectId,
      sync: { type: Number, default: Date.now()},
      access: { type: String, default: "public"},
      publish: { type: Boolean, default: false},
      view: { type: Boolean, default: false}
     }],
    commentedAt : [{
      id: mongoose.Schema.Types.ObjectId,
      sync: { type: Number, default: Date.now()},
      access: { type: String, default: "public"},
      publish: { type: Boolean, default: false},
      view: { type: Boolean, default: false}
     }],
    subscribedBy: [{
      id: mongoose.Schema.Types.ObjectId,
      sync: { type: Number, default: Date.now()},
      access: { type: String, default: "public"},
      publish: { type: Boolean, default: false},
      view: { type: Boolean, default: false}
     }]
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  type: {
    type: String,
    default: 'update'
  },
  category: {
    type: String,
    default: 'message'
  },
  version: {
    type: String,
    default: "0.0.1"
  },
  sync: { type: Number, default: Date.now() }
})

MessengerSchema.methods = {
  getAll: () => {
    return Messenger.find({});
  },

  getById: (_id) => {
    return Messenger.findOne({ _id });
  },

  getMessengerByType: (_type) => {
    return Messenger.findOne({ "type": _type });
  },

  getMessengerByCategory: (_category) => {
    return Messenger.findOne({ "category": _category });
  },

  getMessengerByKey: (_key) => {
    return Messenger.findOne({ "key": _key });
  },

  getMessengerByCategoryKey: (_key, _category) => {
    return Messenger.find({"key": _key, "category": _category});
  },

  getMessengerByTypeKey: (_key, _type) => {
    return Messenger.find({"key": _key, "type": _type});
  },

  getMessengerByTypeCategory: (_type, _category) => {
    return Messenger.find({"type": _type, "category": _category});
  },

  getMessengerByTypeCategoryKey: ( _key, _type, _category ) => {
    return Messenger.find({"key": _key, "type": _type, "category": _category});
  },

  create: (transaction) => {
    return Messenger.create(transaction);
  },

  update: (_id, transaction) => {
    return Messenger.update({ _id }, transaction);
  },

  publishUpdates: (_id, changes) => {
    return Messenger.update({ _id }, {$set: changes});
  },

  remove: (_id) => {
    return Messenger.remove({ _id }, {active: false});
  },

  archive: (_key) => {
    return Messenger.update({ "key": _key }, {active: false});
  }

}

mongoose.model('Messenger', MessengerSchema);
