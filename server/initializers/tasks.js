'use strict';

module.exports = function(app) {
  // Auto load all the tasks in the /tasks folder
  app.set('tasks', require('require-all')({
    dirname     :  __dirname + '/../tasks',
    filter      :  /(.+)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    map         : function (name, path) {
      return name.replace(/_(.)/g, function(match) {
          return match.replace('_','').toUpperCase();
      });
    },
    resolve : function (Task) {
      return new Task(app);
    }
  }));

  var tasks = app.get('tasks');

  // Initialize all the tasks
  for (var taskId in tasks) {
    setTimeout(tasks[taskId].run, tasks[taskId].interval);
  }
};
