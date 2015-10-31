// Plug-in to add time stamps to the models

'use strict';

module.exports = exports = function timeStampsPlugin (schema, options) {
  schema.add({
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  /*
    Before save, update the updatedAt value.
  */
  schema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });

  /*
    Before update, update the updatedAt value.
  */
  schema.pre('update', function (next) {
    this.updatedAt = Date.now();
    next();
  });
};
