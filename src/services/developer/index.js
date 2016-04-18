'use strict';

const service = require('feathers-mongoose');
const developer = require('./developer-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: developer,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/developers', service(options));
  const developerService = app.service('/developers');

  // Set up our before hooks
  developerService.before(hooks.before);
  developerService.after(hooks.after);

  // Setup filters (here we will filter all events)
  developerService.filter(() => false);
};
