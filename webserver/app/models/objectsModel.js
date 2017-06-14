'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var ObjectSchema = new Schema({
  objid: {
    type: String,
    required: true
  },
  oaccess: {
    type: String,
    enum: ['public','private'],
    default: 'Public'
  },
  otype: {
    type: String,
    enum: ['sink','sensor','actuator','sensor','group', 'recipe', 'user'],
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    default: ''
  }
});

ObjectSchema.methods = {
  create: (transaction) => {
    return Objects.create(transaction);
  },

  update: (_id, transaction) => {
    return Objects.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Objects.update({ _id }, {active: false});
  }
};

mongoose.model('Object', ObjectSchema);
//module.exports = mongoose.model('Object');
/*
const Objects = mongoose.model('Object', ObjectSchema);

const model = {};

model.getAll = () => {
  return Objects.find({});
}

model.getById = (_id) => {
  return Objects.findOne({ _id });
}

model.getAllFromObjId = (objid) => {
  return Associations.find({ "objid": objid });
}

model.getAllFromObjType = (objtype) => {
  return Associations.find({ "otype": objtype });
}

model.create = (transaction) => {
  return Objects.create(transaction);
}

model.update = (_id, transaction) => {
  return Objects.update({ _id }, transaction);
}

model.remove = (_id) => {
  return Objects.update({ _id }, {active: false});
}

module.exports = model;
*/
/*
class Objects {
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
