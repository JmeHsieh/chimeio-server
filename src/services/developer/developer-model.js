'use strict';

// developer-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const developerSchema = new Schema({

  // attributes
  username: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: { type: String, required: true, minLength: 8},
  token: { type: String },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },

});

const developerModel = mongoose.model('developer', developerSchema);

module.exports = developerModel;
