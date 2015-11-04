/* Router.js
 *
 * This file is used to store the routing configuration
 * of the web application, so they can be accessed and checked
 * in one place.
 *
 * To create a new route, instantiate a new express router, add
 * it's configuration and attach it to the application.
 */

'use strict';

module.exports = function(app) {
  var express = require("express"),
      controllers = app.get('controllers');

  // NetworkData-related routes
  var networkDataRouter = express.Router();

  networkDataRouter.route('/network_data')
    .get(controllers.networkData.index);

  networkDataRouter.route('/network_data/:id')
    .get(controllers.networkData.show);

  // Attach the router
  app.use('/api', networkDataRouter);
};
