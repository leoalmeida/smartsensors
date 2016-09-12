'use strict'

const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['Débito','Crédito'],
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  valor: {
    type: Number,
    required: true,
    trim: true
  },
  motivo: {
    type: String,
    required: true,
    trim: true
  },
  pago: {
    type: Boolean,
    default: false
  },
  observacao: {
    type: String,
    default: '',
    trim: true
  }
})

const Lancamento = mongoose.model('Lancamento', schema);

const model = {};

model.getAll = () => {
  return Lancamento.find({});
}

model.getAllFromUserId = (userid) => {
  return Lancamento.find({ "user": userid });
}

model.getById = (_id) => {
  return Lancamento.findOne({ _id });
}

model.create = (transaction) => {
  return Lancamento.create(transaction);
}

model.update = (_id, transaction) => {
  return Lancamento.update({ _id }, transaction);
}

model.remove = (_id) => {
  return Lancamento.update({ _id }, {active: false});
}

module.exports = model;

/*
class Lancamento {
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
