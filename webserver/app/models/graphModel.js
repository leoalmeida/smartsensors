'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GraphSchema = new Schema({
    atype_objid: { type: String, required: true, trim: true },
    atype_objid2: { type: String, required: true, trim: true },
    objid: { type: mongoose.Schema.Types.ObjectId, required: true },
    objid2: { type: mongoose.Schema.Types.ObjectId, required: true },
    atype: {
      type: String,
      enum: ['sink','sensor','actuator','sensor','group', 'recipe', 'user'],
      required: true
    },
    data: { type: Schema.Types.Mixed, default: '' },
    time: { type: Date, default: Date.now }
})

GraphSchema.methods = {
  getAll: (_params) => {
      return db.ref("types").child(_params.type);
  },

  getAssociationsByFirstVerticeId: (_params) => {
  	return db.ref().child("associations").orderByChild("atype_objid").equalTo(_params.type+ "_" +_params.id);
  },

  getAssociationsByLastVerticeId: (_params) => {
      return db.ref().child("associations").orderByChild("atype_objid2").equalTo(_params.type+ "_" +_params.id);
  },

  getAssociationById: (_params) => {
      return db.ref("/associations/").child(_params.id);
  },

  newAssociation: (_params) => {
      var newAssociationKey = firebase.database().ref().child('associations').push().key;
      var newAssociation = {
      	objid: newAssociationKey,
      	data: {
                  atype: _params.type,
                  aaccess: 'public',
                  atype_objid: _params.type + "_" + _params.objid,
                  atype_objid2: _params.type + "_" + _params.objid2,
                  data: _params.data,
                  objid: _params.objid,
                  objid2: _params.objid2,
                  time: Date.now()
  		}
  	};

  	return editAssociation(newAssociation);
  },

  editAssociation: (_params) => {
  	var updates = {};
  	updates['/associations/' + _params.objid] = _params.data;
  	return db.ref().update(updates);
  },

  removeAssociation: (_params) => {
  	list.$remove(_params.list.$getRecord(key)).then(function() {
  		console.log("Item removido");
  	}, function(error) {
  		console.log("Error:", error);
  	});
  },


  getObjectById: (_params) => {
  		console.log("Param:", _params.id);
      return db.ref("/objects/" + _params.id );
  },

  getObjectItem: (_params) => {
  		console.log("Param:", _params.id);
      return db.ref("/objects/").orderByChild("objid").equalTo(_params.id);
  },

  newObject: (_params) => {
      var newObjectKey = firebase.database().ref().child('objects').push().key;
      var newObject = {
      	objid: newObjectKey,
      	data: {
              otype: _params.type,
              data: _params.data,
              objid: _params.objid,
              oaccess: 'public',
              time: Date.now()
      	}
      };
      return editObject(newObject);
  },

  editObject: (_params) => {
  	var updates = {};
  	updates['/objects/' + _params.objid] = _params.data;
  	return db.ref().update(updates);
  }
}

mongoose.model('Graph', GraphSchema);
