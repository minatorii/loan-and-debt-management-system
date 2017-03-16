'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Kitty = mongoose.model('Kitty'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Kitty
 */
exports.create = function(req, res) {
  var kitty = new Kitty(req.body);
  kitty.user = req.user;

  kitty.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kitty);
    }
  });
};

/**
 * Show the current Kitty
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var kitty = req.kitty ? req.kitty.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  kitty.isCurrentUserOwner = req.user && kitty.user && kitty.user._id.toString() === req.user._id.toString();

  res.jsonp(kitty);
};

/**
 * Update a Kitty
 */
exports.update = function(req, res) {
  var kitty = req.kitty;

  kitty = _.extend(kitty, req.body);

  kitty.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kitty);
    }
  });
};

/**
 * Delete an Kitty
 */
exports.delete = function(req, res) {
  var kitty = req.kitty;

  kitty.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kitty);
    }
  });
};

/**
 * List of Kitties
 */
exports.list = function(req, res) {
  Kitty.find().sort('-created').populate('user', 'displayName').exec(function(err, kitties) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(kitties);
    }
  });
};

/**
 * Kitty middleware
 */
exports.kittyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Kitty is invalid'
    });
  }

  Kitty.findById(id).populate('user', 'displayName').exec(function (err, kitty) {
    if (err) {
      return next(err);
    } else if (!kitty) {
      return res.status(404).send({
        message: 'No Kitty with that identifier has been found'
      });
    }
    req.kitty = kitty;
    next();
  });
};
