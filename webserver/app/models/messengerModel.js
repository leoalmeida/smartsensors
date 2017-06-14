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
    enum: ['action', 'reading', 'alert'],
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['message'],
    required: true,
    trim: true
  },
  location: {
    type: {type: String, enum: ['Point'], required: true},
    coordinates: [],
    text: { type: String, default: "", trim: true}
  },
  version: {
    type: String,
    default: "0.0.1",
    trim: true
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

  getMessengerBySubtype: (_subtype) => {
    return Messenger.findOne({ "subtype": _subtype });
  },

  getMessengerByKey: (_key) => {
    return Messenger.findOne({ "key": _key });
  },

  getMessengerBySubtypeKey: (_key, _subtype) => {
    return Messenger.find({"key": _key, "subtype": _subtype});
  },

  getMessengerByTypeKey: (_key, _type) => {
    return Messenger.find({"key": _key, "type": _type});
  },

  getMessengerByTypeSubtype: (_type, _subtype) => {
    return Messenger.find({"type": _type, "subtype": _subtype});
  },

  getMessengerByTypeSubtypeKey: ( _key, _type, _subtype ) => {
    return Messenger.find({"key": _key, "type": _type, "subtype": _subtype});
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

/*
class Messenger {
  constructor(tipo=0, valor=0, motivo=null, data=null, pago=false, obs=null) {
    this.tipo = tipo;
    this.valor = valor;
    this.motivo = motivo;
    this.data = data;
    this.pago = pago;
    this.obs = obs;
  }
}


*/
