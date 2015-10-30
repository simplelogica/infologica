'use strict';

module.exports = function(app) {
  var morgan = require("morgan"),
      fs = require('fs'),
      config = app.get('config');

  // Create the stream to the log file
  var logStream = fs.createWriteStream(config.root + '/log/'+process.env.NODE_ENV+'.log',{flags: 'a'});

  app.use(morgan('combined', {stream: logStream}));
  app.use(morgan('dev'));
};
