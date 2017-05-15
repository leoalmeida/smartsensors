'use strict'

const mongoose = require('mongoose');
const ReferenceSchema = new mongoose.Schema({
  actuatorTypes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  sensorTypes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  signTypes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  gatt: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  ledStyles: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  status: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  runaction: {
    type: String,
    default: ''
  },
  msg_status: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  pins: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  units: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  icons: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  types: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  states: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  country: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  addressTypes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  localTypes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  signTypes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  alertTypes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  searchOptionTypes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  alertAttributes: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  alertAttributesValues: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  externalAPIs: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  templates: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  }
})

ReferenceSchema.methods = {
  getAll: () => {
    return Reference.find({});
  },

  getById: (_id) => {
    return Reference.findOne({ _id });
  },

  create: (transaction) => {
    return Reference.create(transaction);
  },

  update: (_id, transaction) => {
    return Reference.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Reference.update({ _id }, {active: false});
  }
}

mongoose.model('Reference', ReferenceSchema);

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
