'use strict';

module.exports = {
  app: {
    secret : 'change_me'
  },

  database : {
    server : 'localhost',
    database : 'infologica_production',
    username : null,
    password : null
  },

  snmpConfig: {
    ipAddress : '127.0.0.1',
    community : 'public',
    downloadSpeedMibs : [],
    uploadSpeedMibs : []
  }
};
