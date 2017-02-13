'use strict'

/*class Post {
  constructor(type=0, value=0, data=null) {
    this.type = type;
    this.value = value;
    this.data = data;
  }
}
*/
/*
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
});

const Post = mongoose.model('Post', schema);
*/

const db = require('../db');

const model = {};

let err = "";

model.getAll = () => {
    return db.ref(_params.equipment + "/public/" );
};

model.getWithKey = (_params) => {
        return db.ref(_params.equipment + "/public/" + _params.key );
};

model.getWithValue = (_params) => {
    return db.ref(_params.equipment + "/public/").orderByChild(_params.key).equalTo(_params.value);
};

model.getInfoWithKey = (_params) => {
    return db.ref("info/public/" + _params.equipment ).orderByChild('sensor').equalTo(_params.key);
};

model.getInfoWithoutKey = (_params) => {
    return db.ref("info/public/" + _params.equipment );
};

model.createInfoWithKey = (_params, trigger) => {
        return db.ref("info/public/" + _params.equipment).push(trigger);
};

model.createWithKey = (_params, trigger) => {
    return db.ref(_params.equipment + "/public/" + _params.key).push(trigger);
};

model.createWithoutKey = (_params, trigger) => {
    return db.ref(_params.equipment + "/public/").push(trigger);
};

model.update = (_params, trigger) => {
        console.log(Object.keys(trigger).length);
        console.log(trigger["connected"] === undefined);
        if (Object.keys(trigger).length>1 || Object.keys(trigger).length<1) return  (err = {msg: "Fail", value: 1});
        if (trigger["connected"] === undefined) return (err = {msg: "Fail", value: 1});

        return db.ref(_params.equipment + "/public/" + _params.key ).update(trigger);
};

model.remove = (_params) => {
        return db.ref(_params.equipment + "/public/" + _params.key ).set(null);
};

module.exports = model;
