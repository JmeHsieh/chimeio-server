'use strict';

const errors = require('feathers-errors');
const crypto = require('crypto');


// Developer
// ================================================================== //
exports.authenticateDeveloper = function(hook) {
  console.log('authenticateDeveloper');

  if (hook.type !== 'before') {
    throw new Error(`The 'authenticateDeveloper' hook should only be used as a 'before' hook.`);
  }

  if (!hook.params.provider) { return Promise.resolve(hook); }

  const token = hook.params.query.token;
  if (!token) { throw new errors.BadRequest('Require token.'); }

  return new Promise((resolve, reject) => {
    hook.app.service('/developers').find({query: {token: token}})
    .then((result) => {
      if (result.total == 0) {
        throw new errors.NotAuthenticated('Invalid token.');
      }
      hook.params.developer = result.data[0];
      resolve(hook);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

exports.associateCurrentDeveloper = function(hook) {
  console.log('associateCurrentDeveloper');
  const idField = '_id';

  if (hook.type !== 'before') {
    throw new Error(`The 'associateCurrentDeveloper' hook should only be used as a 'before' hook.`);
  }

  if (!hook.params.developer) {
    throw new errors.NotAuthenticated('Unauthenticated developer');
  }

  Object.assign(hook.data, {developer: hook.params.developer[idField]});
  return Promise.resolve(hook);
}

exports.restrictToAuthenticatedDeveloper = function(hook) {
  console.log('restrictToAuthenticatedDeveloper');

  if (hook.type !== 'before') {
    throw new Error(`The 'restrictToAuthenticatedDeveloper' hook should only be used as a 'before' hook.`);
  }

  if (hook.params.provider && !hook.params.developer) {
    throw new errors.NotAuthenticated('Unauthenticated developer.');
  }
  return Promise.resolve(hook);
}

exports.restrictToCurrentDeveloper = function(hook) {
  console.log('restrictToCurrentDeveloper');
  const currentDeveloperIdField = '_id';
  const documentDeveloperIdField = 'developer';
  const _this = this;

  if (hook.type !== 'before') {
    throw new Error(`The 'restrictToCurrentDeveloper' hook should only be used as a 'before' hook.`);
  }

  if (!hook.id) {
    throw new Error(`The 'restrictToCurrentDeveloper' hook should only be used on the 'get', 'update', 'patch' and 'remove' service methods.`);
  }

  // If it was an internal call then skip this hook
  if (!hook.params.provider) { return Promise.resolve(hook); }

  if (!hook.params.developer) {
    throw new errors.NotAuthenticated('Unauthenticated developer.');
  }

  const currentDeveloperId = hook.params.developer[currentDeveloperIdField];
  if (!currentDeveloperId) {
    throw new Error(`'Missing ${currentDeveloperIdField}' field of current developer.`);
  }

  return new Promise((resolve, reject) => {
    const params = Object.assign({}, hook.params, {provider: undefined});

    return _this.get(hook.id, params).then((data) => {
      if (data.toJSON) {
        data = data.toJSON();
      } else if (data.toObject) {
        data = data.toObject();
      }

      let documentDeveloperId = data[documentDeveloperIdField];
      if (!documentDeveloperId) {
        documentDeveloperId = data[currentDeveloperIdField];
      }

      if (!documentDeveloperId ||
        documentDeveloperId.toString() !== currentDeveloperId.toString()) {
        return reject(new errors.Forbidden('Permission denied'));
      }

      resolve(hook);
    }).catch(reject);
  });
}

exports.generateDeveloperToken = function(hook) {
  console.log('generateToken');
  const tokenField = 'token';

  if (hook.type !== 'before') {
    throw new Error(`The 'generateDeveloperToken' hook should only be used as a 'before' hook.`);
  }

  let currentDateString = (new Date()).valueOf().toString();
  let random = Math.random().toString();
  let combined = random + currentDateString;
  let token = crypto.createHash('sha1').update(combined).digest('hex');
  hook.data[tokenField] = token;
  return Promise.resolve(hook);
}


// Application
// ================================================================== //
exports.generateApplicationKeys = function(hook) {
  console.log('generateApplicationKeys');
  const apiKeyField = 'apiKey';
  const clientKeyField = 'clientKey';

  if (hook.type !== 'before') {
    throw new Error(`The 'generateKeys' hook should only be used as a 'before' hook.`);
  }

  let currentDateString = (new Date()).valueOf().toString();
  let random = Math.random().toString();
  let combined = random + currentDateString;
  let combinedRev = currentDateString + random;
  let apiKey = crypto.createHash('sha1').update(combined).digest('hex');
  let clientKey = crypto.createHash('sha1').update(combinedRev).digest('hex');
  hook.data[apiKeyField] = apiKey;
  hook.data[clientKeyField] = clientKey;
  return Promise.resolve(hook);
}

exports.authenticateApplication = function(hook) {
  console.log('authenticateApplication');
  const applicationField = 'application';

  if (hook.type !== 'before') {
    throw new Error(`The 'authenticateApplication' hook should only be used as a 'before' hook.`);
  }

  if (!hook.params.provider) { return Promise.resolve(hook); }

  let apiKey = hook.params.query.apiKey;
  let clientKey = hook.params.query.clientKey;
  if (!apiKey || !clientKey) {
    throw new errors.BadRequest('Require apiKey, clientKey.');
  }

  return new Promise((resolve, reject) => {
    let query = {apiKey: apiKey, clientKey: clientKey};
    hook.app.service('/applications').find({query: query}).then((result) => {
      if (result.total === 0) {
        return reject(new errors.NotAuthenticated('Unauthenticated application'));
      }
      hook.params[applicationField] = result.data[0];
      Reflect.deleteProperty(hook.params.query, 'apiKey');
      Reflect.deleteProperty(hook.params.query, 'clientKey');

      resolve(hook);
    }).catch(reject);
  });
}

exports.restrictToAuthenticatedApplication = function(hook) {
  console.log('restrictToAuthenticatedApplication');

  if (hook.type !== 'before') {
    throw new Error(`The 'restrictToAuthenticatedApplication' hook should only be used as a 'before' hook.`);
  }

  if (hook.params.provider && !hook.params.application) {
    throw new errors.NotAuthenticated('Unauthenticated application.');
  }
  return Promise.resolve(hook);
}

exports.restrictToCurrentApplication = function(hook) {
  console.log('restrictToCurrentApplication');
  const currentApplicationIdField = '_id';
  const documentApplicationIdField = 'application';
  const _this = this;

  if (hook.type !== 'before') {
    throw new Error(`The 'restrictToCurrentApplication' hook should only be used as a 'before' hook.`);
  }

  if (!hook.id) {
    throw new Error(`The 'restrictToCurrentApplication' hook should only be used on the 'get', 'update', 'patch' and 'remove' service methods.`);
  }

  // If it was an internal call then skip this hook
  if (!hook.params.provider) { return Promise.resolve(hook); }

  if (!hook.params.application) {
    throw new errors.NotAuthenticated('Unauthenticated application.');
  }

  const currentApplicationId = hook.params.application[currentApplicationIdField];
  if (!currentApplicationId) {
    throw new Error(`'Missing ${currentApplicationId}' field of current application.`);
  }

  return new Promise((resolve, reject) => {
    const params = Object.assign({}, hook.params, {provider: undefined});
    _this.get(hook.id, params).then((data) => {
      const documentApplicationId = data[documentApplicationIdField];
      if (!documentApplicationId ||
        documentApplicationId.toString() !== currentApplicationId.toString()) {
        return reject(new errors.Forbidden('Permission denied'));
      }
      resolve(hook);
    }).catch(reject);
  });
}

exports.associateCurrentApplication = function(hook) {
  console.log('associateCurrentApplication');

  if (hook.type !== 'before') {
    throw new Error(`The 'associateCurrentApplication' hook should only be used as a 'before' hook.`);
  }

  Object.assign(hook.data, {application: hook.params.application._id});
  Promise.resolve(hook);
}


// User
// ================================================================== //
exports.associateCurrentUserAsMember = function(hook) {
  console.log('associateCurrentUserAsMember');

  if (hook.type !== 'before') {
    throw new Error(`The 'dataWithCurrentUserAsMamber' hook should only be used as a 'before' hook.`);
  }

  Object.assign(hook.data, {users: [hook.params.user.id]});
  Promise.resolve(hook);
}

exports.queryWithCurrentUserAsRoomMember = function(hook) {
  console.log('queryWithCurrentUserAsRoomMember');
  const membersField = 'users';
  const currentUserIdField = '_id';

  if (hook.type !== 'before') {
    throw new Error(`The 'queryWithCurrentUserAsRoomMember' hook should only be used as a 'before' hook.`);
  }

  if (!hook.params.provider) {
    return Promise.resolve(hook);
  }

  let query = Object.assign({}, hook.params.query);
  query[membersField] = hook.params.user[currentUserIdField];
  hook.params.query = query;
  Promise.resolve(hook);
}


// Room
// ================================================================== //
exports.restrictToRoomMember = function(hook) {
  console.log('restrictToRoomMember');
  const currentUserIdField = '_id';
  const roomIdField = 'room';
  const _this = this;

  if (hook.type !== 'before') {
    throw new Error(`The 'restrictToRoomMember' hook should only be used as a 'before' hook.`);
  }

  if (!hook.params.provider) { return Promise.resolve(hook); }

  let roomId = '';
  if (_this.Model.modelName === 'message' && (hook.method === 'create' || hook.method === 'find')) {
    roomId = hook.params.query[roomIdField];
  } else if (_this.Model.modelName === 'room' && hook.method === 'get') {
    roomId = hook.id;
  } else {
    throw new Error(`The 'restrictToRoomMember' hook should only be used on certain services or methods.`);
  }

  return new Promise((resolve, reject) => {
    hook.app.service('/rooms').get(roomId, {}).then((room) => {
      if (room.users.indexOf(hook.params.user[currentUserIdField]) === -1) {
        throw new errors.Forbidden('Permission denied.');
      }
      resolve(hook);
    }).catch(reject);
  });
}

exports.associateQueryingRoom = function(hook) {
  console.log('associateQueryingRoom');

  if (hook.type !== 'before') {
    throw new Error(`The 'associateQueryingRoom' hook should only be used as a before hook.`);
  }

  let roomId = hook.params.query.room;
  if (!roomId) {
    throw new Error(`'Missing 'room' field of current query.`);
  }

  hook.data = Object.assign({}, hook.data, {room: roomId});
  Promise.resolve(hook);
}

exports.restrictToRoomAction = function(hook) {
  console.log('restrictToRoomAction');
  const actionField = "action";

  if (hook.type !== 'before') {
    throw new Error(`The 'restrictToRoomAction' hook should only be used as a before hook.`);
  }

  // skip if it's an internal call
  if (!hook.params.provider) {
    return Promise.resolve(hook);
  }

  let roomId = hook.id;
  if (!roomId) {
    throw new Error(`The 'restrictToRoomAction' hook should only be used on the 'patch' service method.`);
  }

  let userId = hook.params.user.id;
  if (!userId) {
    throw new errors.NotAuthenticated('Unauthenticated user');
  }

  let action = hook.params.query[actionField];
  if (!action) {
    throw new errors.BadRequest('Require action.');
  }
  Reflect.deleteProperty(hook.params.query, actionField);

  // join room
  if (action === 'join') {
    return new Promise((resolve, reject) => {
      hook.app.service('/rooms').get(hook.id).then((room) => {
        let members = room.users;
        if (members.indexOf(userId) === -1) {
          members.push(userId);
          Object.assign(hook.data, {users: members});
          resolve(hook);
        }
      }).catch(reject);
    });
  }

  // archive room
  if (action === 'archive') {
    return new Promise((resolve, reject) => {
      hook.app.service('/rooms').get(roomId).then((room) => {
        let members = room.users;
        if (members.indexOf(userId) === -1) {
          return reject(new errors.Forbidden('Permission denied.'));
        }

        let archivedBy = room.archivedBy;
        if (archivedBy.indexOf(userId) === -1) {
          archivedBy.push(userId);
          Object.assign(hook.data, {archivedBy: archivedBy});
          resolve(hook);
        }
      }).catch(reject);
    });
  }

  // if not returned by one of the above userActions
  throw new errors.BadRequest('room action not supported.');
}


// Message
// ================================================================== //
exports.softDelete = function(hook) {
  console.log('softDelete');
  const _this = this;

  if (hook.type !== 'before') {
    throw new Error(`The 'softDelete' hook should only be used as a 'before' hook.`);
  }

  if (hook.method !== 'remove') {
    throw new Error(`The 'softDelete' hook should only be used on 'remove' service method.`);
  }

  return new Promise((resolve, reject) => {
    let params = Object.assign({}, hook.params, {provider: undefined});
    _this.patch(hook.id, {deleted: true}, params).then((data) => {
      hook.result = data;
      resolve(hook);
    }).catch(reject);
  });
}

exports.restrictToUndeleted = function(hook) {
  console.log('restrictToUndeleted');

  if (hook.type !== 'before') {
    throw new Error(`The 'restrictToUndeleted' hook should only be used as a 'before' hook.`);
  }

  if (!hook.params.provider) {
    return Promise.resolve(hook);
  }

  // if it's a find request, add query criteria
  if (hook.method === 'find') {
    Object.assign(hook.params.query, {deleted: false});
    return Promise.resolve(hook);
  }

  let messageId = hook.id;
  if (!messageId) {
    throw new Error(`The 'restrictToUndeleted' hook should only be used on 'get', 'update', 'patch' and 'remove' method`);
  }

  return new Promise((resolve, reject) => {
    hook.app.service('/messages').get(messageId, {}).then((message) => {
      if (message.deleted) {
        return reject(new errors.NotFound('Message not found.'));
      }
      resolve(hook);
    }).catch(reject);
  });
}

exports.check = function(hook) {
  console.log('check');
  console.log(hook);
  Promise.resolve(hook);
}
