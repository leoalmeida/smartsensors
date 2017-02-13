'use strict'

/*const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

const User = mongoose.model('User', schema);

const model = {};

model.getAll = (query = {}) => {
  query.active = true;
  return User.find(query);
}

model.getById = (_id) => {
  return User.findOne({ _id });
}

model.create = (user) => {
  return User.create(user);
}

model.update = (_id, user) => {
  return User.update({ _id }, user);
}

model.remove = (_id) => {
  return User.update({ _id }, {active: false});
}
*/

const db = require('../db');

const model = {};

model.authenticate = (user) => {

  return new Promise((resolve, reject) => {
    db.ref("users/" + user.uid)
        .once("value", data => {
            let value = data.val();
            if (value.token.value && value.token.value != null && value.token.value === user.token && Date.now() <= value.token.expireDate){
                return resolve(value);
            }
            return reject('invalid-token');
        },err => {
            return reject(err);
        });
  });
}

module.exports = model;
