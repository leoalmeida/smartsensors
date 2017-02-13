'use strict'

const db = require('../db');

const model = {};

model.remove = (_params) => {
        return db.ref(_params.equipment + "/public/" + _params.key ).set(null);
};

module.exports = model;
