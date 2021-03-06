'use strict'

const mongoose = require('mongoose');
const DirectorySchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['domainCatalog','resolution','enabler','resources'],
    required: true
  },
  access: {
    type: String,
    enum: ['public','private','restricted'],
    default: "public",
    trim: true
  },
  appName:{
    type: String,
    default : "smartsensors",
    trim: true
  },
  properties: {
      schema: { type: String, default: "http", trim: true },
      host: { type: String, default: "192.168.0.2", trim: true },
      port: { type: Number, default: 3001 },
      radius: { type: Number, default: 0 }
  },
  location: {
    type: {type: String, enum: ['Point'], required: true},
    coordinates: []
  },
  version: { type: String, default: "0.0.1", trim: true },
  sync: { type: Number, default: Date.now() },
  statistics: {quality: {type: Number, default: 100}}
})

DirectorySchema.methods = {
  getAll: () => {
    return Directory.find({});
  },

  getById: (_id) => {
    return Directory.findOne({ _id });
  },

  create: (transaction) => {
    return Directory.create(transaction);
  },

  update: (_id, transaction) => {
    return Directory.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Directory.update({ _id }, {active: false});
  }
}

mongoose.model('Directory', DirectorySchema);

/*
class Knowledge {
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
