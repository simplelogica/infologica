// Task to fetch network data periodically using SNMP
'use strict';

module.exports = function(app) {
  var snmp = require ("net-snmp"),
      _ = require('lodash'),
      config = app.get('config');

  // Variable that contains all the task's variables and configuration
  var task = {};

  // Interval in msecs to execute the task
  task.interval = 1000;

  task.lastMeasure = {
    inOctets : null,
    outOctets : null,
    time : null
  };

  // Session to the SNMP server
  task.session = null;

  // Function to execute
  task.function = function(task) {
    // Create the session if it's empty
    if (task.session === null) {
      console.log("[FetchNetworkData] Creating SNMP session...");
      task.session = snmp.createSession(config.snmp.ipAddress, config.snmp.community);
    }

    var oids = _.merge(config.snmp.inOctetsMibs, config.snmp.outOctetsMibs);

    // Obtain the information about transmitted octects
    task.session.get(oids, function (error, varbinds) {
      if (error) {
        console.error("[FetchNetworkData] Error getting SNMP data: "+error);
      } else {
        for (var i = 0; i < varbinds.length; i++) {
          if (snmp.isVarbindError(varbinds[i])) {
            console.error(snmp.varbindError(varbinds[i]));
          } else {
            console.log(varbinds[i].oid + " = " + varbinds[i].value);
          }
        }
      }
  });
  };

  return task;
};
