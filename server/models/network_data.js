'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    timeStampsPlugin = require('./plugins/time_stamps');

/*
  Define the schema.
*/
var networkDataSchema = new Schema({
  downloadRate:    { type: Number, required: true },
  uploadRate:     { type: Number, required: true },
  connections: {type: [String], required: true }
});

// Add timestamps
networkDataSchema.plugin(timeStampsPlugin);


module.exports = mongoose.model('NetworkData', networkDataSchema);
