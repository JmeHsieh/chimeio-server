'use strict';

// message-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({

  // attributes
  text: { type: String, required: true },
  messageType: {
    type: String,
    enum: ['text', 'image', 'audio', 'video', 'GEO', 'sticker', 'other'],
    'default': 'text',
    required: true,
  },
  deleted: { type: Boolean, 'default': false },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now },

  // relationships
  application: { type: Schema.Types.ObjectId, ref: 'application', require: true },
  room: { type: Schema.Types.ObjectId, ref: 'room', require: true },
  user: { type: Schema.Types.ObjectId, ref: 'user', require: true },
  
});

const messageModel = mongoose.model('message', messageSchema);

module.exports = messageModel;
