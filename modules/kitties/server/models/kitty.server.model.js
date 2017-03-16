'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Kitty Schema
 */
var KittySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Kitty name',
    trim: true
  },
  cats:{
    type: String,
    default: '',
    trim: true
  }
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Kitty', KittySchema);
