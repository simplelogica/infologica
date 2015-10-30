'use strict';

module.exports = function(app) {
  // Auto load all the models in the /models folder
  app.set('models', require('require-all')({
    dirname     :  __dirname + '/../models',
    filter      :  /(.+)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    map         : function (name, path) {
      return name.replace(/_(.)/g, function(match) {
          return match.replace('_','').toUpperCase();
      });
    }
  }));
};
