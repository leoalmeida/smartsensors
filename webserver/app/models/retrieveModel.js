'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RetrieveSchema = new Schema({})

RetrieveSchema.methods = {
  getAll: (_params) => {
      return db.ref(_params.equipment + "/public/" );
  },

  getWithKey: (_params) => {
          return db.ref(_params.equipment + "/public/" + _params.key );
  },

  getWithValue: (_params) => {
      return db.ref(_params.equipment + "/public/").orderByChild(_params.key).equalTo(_params.value);
  },

  getInfoWithKey: (_params) => {
      return db.ref("info/public/" + _params.equipment ).orderByChild('sensor').equalTo(_params.key);
  },

  getInfoWithoutKey: (_params) => {
      return db.ref("info/public/" + _params.equipment );
  }
}

mongoose.model('Retrieve', RetrieveSchema);


/*
const db = require('../db');

const model = {};

let err = "";

model.getAll = (_params) => {
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


module.exports = model;
*/
