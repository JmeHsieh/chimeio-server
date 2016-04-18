'use strict';

const service = require('feathers-mongoose');
const room = require('./room-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: room,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/rooms', service(options));
  const roomService = app.service('/rooms');

  // Set up our before hooks
  roomService.before(hooks.before);
  roomService.after(hooks.after);

  // Setup filters (here we will filter all events)
  roomService.filter({
    created(data, connection) {
      const userIdField = '_id';

      // filter out unauthenticated socket
      let userId = connection.user[userIdField];
      if (!userId) { return false; }

      // filter room creater him/her-self
      if (userId.toString() === data.user.toString()) { return false; }

      // filter out non-room-member socket
      return data.users.indexOf(userId) !== -1;
    },
    updated() { return false; },
    patched() { return false; },
    removed() { return false; }
  });
};
