'use strict';

const service = require('feathers-mongoose');
const application = require('./application-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: application,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/applications', service(options));

  // Get our initialize service to that we can bind hooks
  const applicationService = app.service('/applications');

  // Set up our before hooks
  applicationService.before(hooks.before);

  // Set up our after hooks
  applicationService.after(hooks.after);
};
