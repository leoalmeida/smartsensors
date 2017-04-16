'use strict'

const mongoose = require('mongoose');
const SemanticSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['Débito','Crédito'],
    required: true
  },
  SemanticId: {
    type: String,
    required: true
  },
  observacao: {
    type: String,
    default: '',
    trim: true
  }
})

SemanticSchema.methods = {
  getAll: () => {
    return Semantic.find({});
  },

  getAllFromSemanticId: (semanticId) => {
    return Semantic.find({ "semanticId": semanticId });
  },

  getById: (_id) => {
    return Semantic.findOne({ _id });
  },

  create: (transaction) => {
    return Semantic.create(transaction);
  },

  update: (_id, transaction) => {
    return Semantic.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Semantic.update({ _id }, {active: false});
  }

}

mongoose.model('Semantic', SemanticSchema);

/*
class Semantic {
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
