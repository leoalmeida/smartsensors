'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContextsSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  next: {
    type: String,
    required: true
  },
  parent: {
    context: {
      type: String,
      default: ""
    },
    item: {
      type: String,
      default: ""
    }
  },
  properties: {
    type: Array,
    default: '',
    trim: true
  },
  locators: {
    type: Array,
    default: '',
    trim: true
  },
  semantics: {
    type: Array,
    default: '',
    trim: true
  },
  knowledge: {
    type: Array,
    default: '',
    trim: true
  },
  type: {
    type: String,
    enum: ['sink','sensor','actuator','sensor','group', 'recipe', 'user'],
    required: true
  },
  time: { type: Date, default: Date.now }
})

ContextsSchema.methods = {
  getAll: () => {
    return Contexts.find({});
  },

  getById: (_id) => {
    return Contexts.findOne({ _id });
  },

  create: (transaction) => {
    return Contexts.create(transaction);
  },

  update: (_id, transaction) => {
    return Contexts.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Contexts.update({ _id }, {active: false});
  }
}


mongoose.model('Context', ContextsSchema);
/*
class Contexts {
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
