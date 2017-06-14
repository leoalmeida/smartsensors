var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
    id: { type: String, required: true },    
    is_published: { type: Boolean, default: false },
    value: { type: String, required: true },
    tags: [ {type: String} ],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    synced: { type: Date, default: Date.now }
});

mongoose.model('Document', DocumentSchema);
