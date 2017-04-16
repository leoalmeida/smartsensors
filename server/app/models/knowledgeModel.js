'use strict'

const mongoose = require('mongoose');
const KnowledgeSchema = new mongoose.Schema({
  abstraction: {
    type: String,
    default: ""
  },
  previous: {
    type: String,
    default: ""
  },
  next: {
    type: String,
    default: ""
  },
  parent: {
    type: String,
    default: ""
  },
  direction: {
    type: String,
    enum: ['all','one'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
  },
  type: {
    type: String,
    enum: ['association','object'],
    required: true
  },
  types: {
    type: Array,
    default: '',
    trim: true
  },
  version: {
    type: String,
    default: "0.0.1",
    trim: true
  },
  time: { type: Date, default: Date.now }
})

KnowledgeSchema.methods = {
  getAll: () => {
    return Knowledge.find({});
  },

  getById: (_id) => {
    return Knowledge.findOne({ _id });
  },

  create: (transaction) => {
    return Knowledge.create(transaction);
  },

  update: (_id, transaction) => {
    return Knowledge.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Knowledge.update({ _id }, {active: false});
  }
}

mongoose.model('Knowledge', KnowledgeSchema);

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
