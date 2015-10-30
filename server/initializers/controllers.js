'use strict';

module.exports = function(app) {
  // Autoload all the controllers in the /controllers folder.
  app.set('controllers', require('require-all')({
    dirname     :  __dirname + '/../controllers',
    filter      :  /(.+_controller)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    map         : function (name, path) {
      return name.replace(/_controller/g, '').replace(/_(.)/g, function(match) {
          return match.replace('_','').toUpperCase();
      });
    }
  }));
};
