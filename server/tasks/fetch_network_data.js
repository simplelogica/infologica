// Task to fetch network data periodically using SNMP
'use strict';

module.exports = function(app) {
  var snmp = require ("net-snmp"),
      _ = require('lodash'),
      config = app.get('config');

  var mongoose = require('mongoose'),
      NetworkData  = mongoose.model('NetworkData');

  // Variable that contains all the task's variables and configuration
  var task = {};

  // Interval in msecs to execute the task
  task.interval = 2000;

  task.lastMeasure = null;

  // Session to the SNMP server
  task.session = null;

  // Function to execute
  task.function = function(task) {
    // Create the session if it's empty
    if (task.session === null) {
      console.log("[FetchNetworkData] Creating SNMP session...");
      task.session = snmp.createSession(config.snmp.ipAddress, config.snmp.community);
    }

    var oids = _.union(config.snmp.inOctetsMibs, config.snmp.outOctetsMibs, [config.snmp.upTimeMib]);

    // Obtain the information about transmitted octects
    task.session.get(oids, function (error, varbinds) {
      if (error) {
        console.error("[FetchNetworkData] Error getting SNMP data: "+error);
      } else {
        var upTime = 0,
            inOctets = 0,
            outOctets = 0;

        for (var i = 0; i < varbinds.length; i++) {
          if (snmp.isVarbindError(varbinds[i])) {
            console.error("[FetchNetworkData] Error getting SNMP data: "+snmp.varbindError(varbinds[i]));
          } else {
            if (config.snmp.upTimeMib === varbinds[i].oid) { upTime = varbinds[i].value;}
            if (_.indexOf(config.snmp.inOctetsMibs, varbinds[i].oid) >= 0) { inOctets += varbinds[i].value;}
            if (_.indexOf(config.snmp.outOctetsMibs, varbinds[i].oid) >= 0) { outOctets += varbinds[i].value;}
          }
        }

        // If there is a past measure and uptime hasn't increased, there is no fresh data.
        if ((task.lastMeasure === null) || (upTime > task.lastMeasure.upTime)) {

          // Calculate the network rato anly if there are at least two samples
          if (task.lastMeasure !== null ) {
            var inputSpeed = Math.floor((inOctets - task.lastMeasure.inOctets)*8/(upTime - task.lastMeasure.upTime)),
                outputSpeed = Math.floor((outOctets - task.lastMeasure.outOctets)*8/(upTime - task.lastMeasure.upTime));

            var networkData = new NetworkData({
              downloadRate: inputSpeed,
              uploadRate:  outputSpeed,
              connections:  ['test'] // TODO: get a list of IP connections.
            });

            networkData.save(function(err, networkData) {
              if(err) {
                console.error("[FetchNetworkData] Error saving the network data: "+err.message);
              } else {
                console.log("[FetchNetworkData] Measures - Inboud = "+inputSpeed+"bps Outbound = "+outputSpeed+"bps");
              }
            });
          }

          // Save this sample
          task.lastMeasure = {
            inOctets : inOctets,
            outOctets : outOctets,
            upTime : upTime
          };

          console.log("[FetchNetworkData] Last measure - upTime = "+task.lastMeasure.upTime+" inOctets = "+task.lastMeasure.inOctets+" outOctets = "+task.lastMeasure.outOctets);
        }
      }
  });
  };

  return task;
};
