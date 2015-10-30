'use strict';

module.exports = function(app) {
  var mongoose = require('mongoose'),
      config = app.get('config');

  // Construct the Mongo connection's URI
  config.database.uri = config.database.server+'/'+config.database.database;

  // If there are login credentials, use them
  if (config.database.username !== null) {
    config.database.uri = config.database.username+':'+config.database.password+'@'+config.database.uri;
  }

  // Add the protocol
  config.database.uri = 'mongodb://'+config.database.uri;

  mongoose.connect(config.database.uri, function(err) {
      if(err) { throw err; }
      console.log('[INIT] Connected to MongoDB database at '+config.database.uri);
  });
};
