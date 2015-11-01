'use strict';

module.exports = {
  app: {
    secret : 'change_me'
  },

  database : {
    server : 'localhost',
    database : 'infologica_development',
    username : null,
    password : null
  },

  snmp: {
    ipAddress : '127.0.0.1',
    community : 'public',
    mib: {
      upTime : '1.3.6.1.2.1.1.3.0',
      inOctets : ['1.3.6.1.2.1.2.2.1.10.4'],
      outOctets : ['1.3.6.1.2.1.2.2.1.16.4'],
      ipAddresses : '1.3.6.1.2.1.6.13.1.4'
    }
  }
};
