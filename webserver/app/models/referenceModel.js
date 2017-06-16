'use strict'

const mongoose = require('mongoose');
const ReferenceSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true
  },
  values: {
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
