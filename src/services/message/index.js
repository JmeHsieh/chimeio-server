'use strict';

const service = require('feathers-mongoose');
const message = require('./message-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: message,
    paginate: {
      default: 25,
      max: 50
    }
  };

  // Initialize our service with any options it requires
  app.use('/messages', service(options));
  const roomService = app.service('/rooms');

  // Get our initialize service to that we can bind hooks
  const messageService = app.service('/messages');

  // Setup hooks
  messageService.before(hooks.before);
  messageService.after(hooks.after);

  // Setup filters (here we will filter all events)
  messageService.filter((data, connection) => {
    const userIdField = '_id';

    // filter out unauthenticated socket
    const userId = connection.user[userIdField];
    if (!userId) { return false; }

    // filter out message sender him/her-self
    if (userId.toString() === data.user.toString()) { return false; }

    // filter out non-room-member socket
    const roomId = data.room;
    return new Promise((resolve, reject) => {
      roomService.get(roomId, {}).then((room) => {
        if (room.users.indexOf(userId) === -1) { reject(); }
        resolve(data);
      }).catch(reject);
    });
  });
};
