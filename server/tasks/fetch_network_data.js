// Task to fetch network data periodically using SNMP
'use strict';

// Variable that contains all the task's variables and configuration
var task = {};

// Interval in msecs to execute the task
task.interval = 1000;

// Function to execute
task.function = function() {
  // The magic goes here
  console.log("The task is running!");
};

module.exports = task;
