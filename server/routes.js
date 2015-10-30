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

  // User-related routes
  var usersRouter = express.Router();

  usersRouter.route('/users')
    .get(controllers.users.findAllUsers)
    .post(controllers.users.addUser);

  usersRouter.route('/user/:id')
    .get(controllers.users.findById)
    .put(controllers.users.updateUser)
    .delete(controllers.users.deleteUser);

  // Attach the router
  app.use('/api', usersRouter);
};
