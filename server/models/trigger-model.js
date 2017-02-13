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

model.getAll = () => {
    return db.ref(_params.equipment + "/public/" );
};
model.getById = (_params) => {
    switch (_params.keytype) {
        case "key":
            return db.ref(_params.equipment + "/public/" + _params.key );
            break;
        default:
            return "error";
    }
};

model.create = (_params, trigger) => {
    switch (_params.keytype) {
        case "key":
            return db.ref(_params.equipment + "/public/" + _params.key).push(trigger);
            break;
        default:
            return "error";
    }
};

model.update = (_params, trigger) => {
    switch (_params.keytype) {
        case "key":
            return db.ref(_params.equipment + "/public/" + _params.key ).update(trigger);
            break;
        default:
            return "error";
    }
};

model.remove = (_params) => {
    switch (_params.keytype) {
        case "key":
            return db.ref(_params.equipment + "/public/" + _params.key ).set(null);
            break;
        default:
            return "error";
    }
};

module.exports = model;
