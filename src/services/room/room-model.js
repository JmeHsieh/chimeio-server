'use strict';

// room-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({

  // attributes
  isPublic: { type: Boolean, 'default': false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },

  // relationships
  application: { type: Schema.Types.ObjectId, ref: 'application', required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'user' }],
  archivedBy: [{ type: Schema.Types.ObjectId, ref: 'user' }],
});

// Create Multikey Indexes on 'users' field
// So that we can query all rooms under a user by using:
// Room.find({users: my_user_id}, function(err, rooms){});
roomSchema.index({'users': 1});

const roomModel = mongoose.model('room', roomSchema);

module.exports = roomModel;
