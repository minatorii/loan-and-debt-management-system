'use strict';

/**
 * Module dependencies
 */
var kittiesPolicy = require('../policies/kitties.server.policy'),
  kitties = require('../controllers/kitties.server.controller');

module.exports = function(app) {
  // Kitties Routes
  app.route('/api/kitties').all(kittiesPolicy.isAllowed)
    .get(kitties.list)
    .post(kitties.create);

  app.route('/api/kitties/:kittyId').all(kittiesPolicy.isAllowed)
    .get(kitties.read)
    .put(kitties.update)
    .delete(kitties.delete);

  // Finish by binding the Kitty middleware
  app.param('kittyId', kitties.kittyByID);
};
