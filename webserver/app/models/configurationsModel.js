'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfigurationsSchema = new Schema({
  actuatorTypes: {
    type: Array,
    default: '',
    trim: true
  },
  addressTypes: {
      type: String,
      enum: [ 'casa', 'edifício', 'sobrado'],
      trim: true
    },
  alertAttributes : {
    type: Array,
    default: '',
    trim: true
  },
  alertAttributesValues : {
    type: Array,
    default: '',
    trim: true
  },
  alertTypes : {
      type: Array,
      default: '',
      trim: true
    },
  country : {
    type: String,
    enum: ['BR','AR', 'PR', 'UR'],
    trim: true
  },
  externalAPIs : {
      access : { type: Array, default: '',trim: true },
      endpoints : { type: Array, default: '',trim: true },
      facebook : {
        apis : {
          facebookInfo : {
            attributes : { type: String, default: '', trim: true },
            parameters : { type: Array, default: '',trim: true },
            path : { type: String, default: '', trim: true }
          },
          getid : {
            attributes : { type: Array, default: '',trim: true },
            parameters : {
              access_token : { type: String, default: '', trim: true },
            },
            path : { type: String, default: '', trim: true }
          }
        },
        clientInfo : {
          appId : { type: String, default: '', trim: true },
          appSecret : { type: String, default: '', trim: true },
          clientToken : { type: String, default: '', trim: true },
          secret : { type: String, default: '', trim: true }
        },
        executeFunction :  { type: String, default: '', trim: true },
        url : { type: String, default: '', trim: true },
        version : { type: String, default: '', trim: true }
      },
      firebase : {
        apis : { type: String, default: '', trim: true },
        clientInfo : {
          appId : { type: String, default: '', trim: true },
          appSecret : { type: String, default: '', trim: true },
          clientToken : { type: String, default: '', trim: true }
        },
        executeFunction : { type: String, default: '', trim: true },
        url : { type: String, default: '', trim: true }
      },
      github : {
        apis : { type: String, default: '', trim: true },
        clientInfo : {
          appId : { type: String, default: '', trim: true },
          appSecret : { type: String, default: '', trim: true },
          clientToken : { type: String, default: '', trim: true }
        },
        executeFunction : { type: String, default: '', trim: true },
        url : { type: String, default: '', trim: true }
      },
      google : {
        apis : {
          interestByRegion : {
            attributes : { type: String, default: '', trim: true },
            output : {
              type: String,
              enum: [ "geoName", "value" ],
              trim: true
            },
            parameters : {
              type: String,
              enum: [ "keyword", "startTime", "endTime", "geo", "hl" ],
              trim: true
            },
            path : { type: String, default: '', trim: true },
            root : { type: String, default: '', trim: true }
          },
          interestOverTime : {
            attributes : { type: String, default: '', trim: true },
            output : {
              type: String,
              enum: [ "time", "value" ],
              trim: true
            },
            parameters : {
              type: String,
              enum: [ "keyword", "startTime", "endTime", "geo", "resolution" ],
              trim: true
            },
            path : { type: String, default: '', trim: true },
            root : { type: String, default: '', trim: true }
          },
          relatedQueries : {
            attributes : { type: String, default: '', trim: true },
            output : {
              type: String,
              enum: [ "value" ],
              trim: true
            },
            parameters : {
              type: String,
              enum: [ "keyword", "startTime", "endTime", "geo", "hl" ],
              trim: true
            },
            path : { type: String, default: '', trim: true },
            root : { type: String, default: '', trim: true }
          },
          relatedTopics : {
            attributes : { type: String, default: '', trim: true },
            output : {
              type: String,
              enum: [ "value" ],
              trim: true
            },
            parameters : {
              type: String,
              enum: [ "keyword", "startTime", "endTime", "geo", "hl" ],
              trim: true
            },
            path : { type: String, default: '', trim: true },
            root : { type: String, default: '', trim: true }
          }
        },
        clientInfo : {
          appId : { type: String, default: '', trim: true },
          appSecret : { type: String, default: '', trim: true },
          clientToken : { type: String, default: '', trim: true }
        },
        executeFunction : { type: String, default: '', trim: true },
        url : { type: String, default: '', trim: true }
      },
      twitter : {
        apis : {
          search : {
            attributes : { type: String, default: '', trim: true },
            parameters : {
              type: String,
              enum: ['q'],
              trim: true
            },
            path : { type: String, default: '', trim: true }
          },
          trends : {
            attributes : { type: String, default: '', trim: true },
            parameters : {
              type: String,
              enum: ['id'],
              trim: true
            },
            path : { type: String, default: '', trim: true }
          }
        },
        clientInfo : {
          appId : { type: String, default: '', trim: true },
          appSecret : { type: String, default: '', trim: true },
          clientToken : { type: String, default: '', trim: true },
          token_type : { type: String, default: '', trim: true }
        },
        executeFunction : { type: String, default: '', trim: true },
        url : { type: String, default: '', trim: true },
        version : { type: String, default: '', trim: true }
      }
    },
  gatt : {
      characteristics : {
        type: Array,
        default: '',
        trim: true
      },
      declarations : { type: String, default: '', trim: true },
      descriptors : {
        type: Array,
        default: '',
        trim: true
      },
      services : {
        type: Array,
        default: '',
        trim: true
      }
    },
  icons : {
      type: Array,
      default: '',
      trim: true
    },
  ledStyles : {
    type: String,
    enum: ['Blink','Pulse', 'Fade'],
    trim: true
  },
  localTypes : {
    type: String,
    enum: ['comercial','residencial'],
    trim: true
  },
  msg_status : {
    type: String,
    enum: ['STATUS_FAILED','ALL', "STATUS_SAVED", "STATUS_SENDING", "STATUS_SENT", "STATUS_RECEIVED", "STATUS_READ"],
    trim: true
  },
  pins : {
    type: String,
    enum: ['A0','A1', 'A2', 'A3', 'A4', 'A5', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13'],
    trim: true
  },
  runactions : {
    type: Boolean,
    enum: [false, true],
    trim: true
  },
  searchOptionTypes : {
      type: Array,
      default: '',
      trim: true
    },
  sensorTypes : {
      type: Array,
      default: '',
      trim: true
    },
  signTypes : {
      type: Array,
      default: '',
      trim: true
    },
  states : {
    type: String,
    enum: ['RJ','SP', 'MG'],
    trim: true
  },
  status : {
    type: String,
    enum: ["BLOCKED", "EXPIRED", "DISABLED", "FAILED", "OFFLINE", "ONLINE", "ACTIVE"],
    trim: true
  },
  templates : {
      actions : { type: Array, default: '',trim: true },
      connectors : { type: Array, default: '',trim: true },
      recipes : { type: Array, default: '',trim: true },
      rules : { type: Array, default: '',trim: true }
    },
  types : {
    type: String,
    enum: [ "moisture", "oscillator", "led", "motion", "waterflow" ],
    trim: true
  },
  units : {
    type: String,
    enum: [ "cm", "m", "%", "°C", "!", "l", "cd" ],
    trim: true
  }
})

ConfigurationsSchema.methods = {
  getAll: () => {
    return Configurations.find({});
  },

  getById: (_id) => {
    return Configurations.findOne({ _id });
  },

  create: (transaction) => {
    return Configurations.create(transaction);
  },

  update: (_id, transaction) => {
    return Configurations.update({ _id }, transaction);
  },

  remove: (_id) => {
    return Configurations.update({ _id }, {active: false});
  }
}

mongoose.model('Configurations', ConfigurationsSchema);

/*
const Configurations = mongoose.model('Configurations', ConfigurationsSchema);
const model = {};

model.getAll = () => {
  return Configurations.find({});
}

model.getById = (_id) => {
  return Configurations.findOne({ _id });
}

model.create = (transaction) => {
  return Configurations.create(transaction);
}

model.update = (_id, transaction) => {
  return Configurations.update({ _id }, transaction);
}

model.remove = (_id) => {
  return Configurations.update({ _id }, {active: false});
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
