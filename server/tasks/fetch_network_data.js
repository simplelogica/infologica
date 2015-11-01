// Task to fetch network data periodically using SNMP
'use strict';

module.exports = function(app) {
  var snmp = require ("net-snmp"),
      _ = require('lodash'),
      config = app.get('config');

  var mongoose = require('mongoose'),
      NetworkData  = mongoose.model('NetworkData');

  var task = {            // Variable that contains all the task's variables and configuration
    interval : 3000,      // Interval in msecs to execute the task
    lastMeasure : null,   // Last measure from the network
    session : null        // Session to the SNMP server
  };

  // Function to schedule the next execution
  task.scheduleExecution = function() {
    setTimeout(function() { task.run(); }, task.interval);
  };

  task.run = function() {
    // Create the session if it's empty
    if (task.session === null) {
      console.log("[FetchNetworkData] Creating SNMP session...");
      task.session = snmp.createSession(config.snmp.ipAddress, config.snmp.community, {version: snmp.Version2c});
    }

    var oids = _.union(config.snmp.mib.inOctets, config.snmp.mib.outOctets, [config.snmp.mib.upTime]),
        upTime = 0,
        inOctets = 0,
        outOctets = 0,
        ipAddresses = [];

    // Obtain the information about transmitted octects
    task.session.get(oids, function (error, varbinds) {
      if (error) {
        console.error("[FetchNetworkData] Error getting SNMP data: "+error.message);
      } else {
        // Fetch all the data from the SNMP result and clasify it
        for (var i = 0; i < varbinds.length; i++) {
          if (snmp.isVarbindError(varbinds[i])) {
            console.error("[FetchNetworkData] Error getting SNMP data: "+snmp.varbindError(varbinds[i]));
          } else {
            if (config.snmp.mib.upTime === varbinds[i].oid) { upTime = varbinds[i].value;} // Uptime
            if (_.indexOf(config.snmp.mib.inOctets, varbinds[i].oid) >= 0) { inOctets += varbinds[i].value;} // Inbound octets
            if (_.indexOf(config.snmp.mib.outOctets, varbinds[i].oid) >= 0) { outOctets += varbinds[i].value;} // Outbound octets
          }
        }

        // If there is a past measure and uptime hasn't increased, there is no fresh SNMP data.
        if ((task.lastMeasure === null) || (upTime > task.lastMeasure.upTime)) {
          // Get the remote IP addresses of TCP connections
          task.session.subtree(config.snmp.mib.ipAddresses, function(varbinds){
            // Store received IP addresses
            for (var i = 0; i < varbinds.length; i++) {
              ipAddresses.push(varbinds[i].value);
            }
          }, function(err){
            if (err) {
              console.error("[FetchNetworkData] Error getting IP addresses: "+err.message);
            } else {
              // Processand save the data
              task.processData(inOctets, outOctets, upTime, _.uniq(ipAddresses));
            }

            // Schedule next execution
            task.scheduleExecution(task);
          });
        } else {
          // If there is no change in the upTime variable, schedule next execution
          task.scheduleExecution(task);
        }
      }
    });
  };

  // Auxiliar function to store the data in the DB
  task.processData = function(inOctets, outOctets, upTime, ipAddresses) {
    if (task.lastMeasure !== null) {
      var downloadRate = Math.floor((inOctets - task.lastMeasure.inOctets)*8/(upTime - task.lastMeasure.upTime)),
          uploadRate = Math.floor((outOctets - task.lastMeasure.outOctets)*8/(upTime - task.lastMeasure.upTime));

      // Build the object
      var networkData = new NetworkData({
        downloadRate: downloadRate,
        uploadRate:  uploadRate,
        connections:  ipAddresses
      });

      // Try to save it
      networkData.save(function(err, networkData) {
        if(err) {
          console.error("[FetchNetworkData] Error saving the network data: "+err.message);
        } else {
          console.log("[FetchNetworkData] DL = "+downloadRate+"bps UL = "+uploadRate+"bps");
        }
      });
    }

    // Save this sample for next execution
    task.lastMeasure = {
      inOctets : inOctets,
      outOctets : outOctets,
      upTime : upTime
    };

    console.log("[FetchNetworkData] Last measure - upTime = "+task.lastMeasure.upTime+" inOctets = "+task.lastMeasure.inOctets+" outOctets = "+task.lastMeasure.outOctets);
  };

  return task;
};
