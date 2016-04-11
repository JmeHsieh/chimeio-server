'use strict';

// application-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({

  // attributes
  title: { type: String, required: true },
  apiKey: { type: String, required: true },
  clientKey: { type: String, required: true },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },

  // relationships
  developer: { type: Schema.Types.ObjectId, ref: 'developer', required: true },
});

const applicationModel = mongoose.model('application', applicationSchema);

module.exports = applicationModel;
