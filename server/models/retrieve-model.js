'use strict'

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
