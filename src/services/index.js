'use strict';
const message = require('./message');
const room = require('./room');
const application = require('./application');
const developer = require('./developer');
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');
module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(user);
  app.configure(developer);
  app.configure(application);
  app.configure(room);
  app.configure(message);
};
