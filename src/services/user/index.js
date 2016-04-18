'use strict';

const service = require('feathers-mongoose');
const user = require('./user-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: user,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/users', service(options));
  const userService = app.service('/users');

  // Set up hooks
  userService.before(hooks.before);
  userService.after(hooks.after);

  // Setup filters (here we will filter all events)
  userService.filter(() => false);
};
