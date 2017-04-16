'use strict'

'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RemoveSchema = new Schema({})

RemoveSchema.methods = {
  remove: (_params) => {
          return db.ref(_params.equipment + "/public/" + _params.key ).set(null);
  }
}

mongoose.model('Remove', RemoveSchema);

/*
const db = require('../db');

const model = {};

model.remove = (_params) => {
        return db.ref(_params.equipment + "/public/" + _params.key ).set(null);
};

module.exports = model;

*/
