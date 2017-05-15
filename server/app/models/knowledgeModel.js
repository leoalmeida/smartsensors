'use strict'

const mongoose = require('mongoose');
const KnowledgeSchema = new mongoose.Schema({
  relations: {
    type: mongoose.Schema.Types.Mixed,
    default: ''
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
  subtype: {
    type: String,
    enum: ['profile','social','actuator','sensor','topic','sink','own','connected','notify','publish'],
    required: true
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

  getKnowledgeByType: (_type) => {
    return Knowledge.findOne({ "type": _type });
  },

  getKnowledgeBySubtype: (_subtype) => {
    return Knowledge.findOne({ "subtype": _subtype });
  },

  getKnowledgeByKey: (_key) => {
    return Knowledge.findOne({ "key": _key });
  },

  getKnowledgeBySubtypeKey: (_key, _subtype) => {
    return Knowledge.find({"key": _key, "subtype": _subtype});
  },

  getKnowledgeByTypeKey: (_key, _type) => {
    return Knowledge.find({"key": _key, "type": _type});
  },

  getKnowledgeByTypeSubtype: (_type, _subtype) => {
    return Knowledge.find({"type": _type, "subtype": _subtype});
  },

  getKnowledgeByTypeSubtypeKey: ( _key, _type, _subtype ) => {
    return Knowledge.find({"key": _key, "type": _type, "subtype": _subtype});
  },

  create: (transaction) => {
    return Knowledge.create(transaction);
  },

  update: (_id, transaction) => {
    return Knowledge.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Knowledge.remove({ _id }, {active: false});
  },

  archive: (_key) => {
    return Knowledge.update({ "key": _key }, {active: false});
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
