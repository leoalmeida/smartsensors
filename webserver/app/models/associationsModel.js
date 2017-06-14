'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AssociationSchema = new Schema({
    atype_objid: { type: String, required: true, trim: true },
    atype_objid2: { type: String, required: true, trim: true },
    objid: { type: String, required: true },
    objid2: { type: String, required: true },
    atype: {
      type: String,
      enum: ['sink','sensor','actuator','sensor','group', 'recipe', 'user'],
      required: true
    },
    data: { type: Schema.Types.Mixed, default: '' },
    time: { type: Date, default: Date.now }
})

AssociationSchema.methods = {

  getAll: () => {
    return Associations.find({});
  },

  getAllFromObjId: (objid) => {
    return Associations.find({ "objid": objid });
  },

  getAllFromObjId2: (userid) => {
    return Associations.find({ "objid2": objid });
  },

  getAllFromTypeObjId: (value) => {
    return Associations.find({ "atype_objid": value });
  },

  getAllFromTypeObjId2: (value) => {
    return Associations.find({ "atype_objid2": value });
  },

  getById: (_id) => {
    return Associations.findOne({ _id });
  },

  create: (transaction) => {
    return Associations.create(transaction);
  },

  update: (_id, transaction) => {
    return Associations.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Associations.update({ _id }, {active: false});
  },

}

mongoose.model('Association', AssociationSchema);
/*
const Associations = mongoose.model('Association', AssociationSchema);

const model = {};

model.getAll = () => {
  return Associations.find({});
}

model.getAllFromObjId = (objid) => {
  return Associations.find({ "objid": objid });
}

model.getAllFromObjId2 = (userid) => {
  return Associations.find({ "objid2": objid });
}

model.getAllFromTypeObjId = (value) => {
  return Associations.find({ "atype_objid": value });
}

model.getAllFromTypeObjId2 = (value) => {
  return Associations.find({ "atype_objid2": value });
}

model.getById = (_id) => {
  return Associations.findOne({ _id });
}

model.create = (transaction) => {
  return Associations.create(transaction);
}

model.update = (_id, transaction) => {
  return Associations.update({ _id }, transaction);
}

model.remove = (_id) => {
  return Associations.update({ _id }, {active: false});
}

module.exports = model;
*/
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
