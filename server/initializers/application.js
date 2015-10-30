'use strict';

module.exports = function(app) {
  var express = require("express"),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      compression = require("compression"),
      path = require("path");

  var config = app.get("config");

  // Serve static assets
  app.use(express.static(path.normalize(path.join(config.root, '..', 'client'))));

  // Body parsers
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Common middlewares
  app.use(compression());
  app.use(methodOverride());
};
