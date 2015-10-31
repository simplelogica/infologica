'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    timeStampsPlugin = require('./plugins/timeStamps');

/*
  Define the schema.
*/
var networkDataSchema = new Schema({
  downloadRate:    { type: String, required: true },
  uploadRate:     { type: String, required: true },
  connections: {type: [String], required: true }
});

// Add timestamps
networkDataSchema.plugin(timeStampsPlugin);


module.exports = mongoose.model('SnmpData', networkDataSchema);
