'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [
    globalHooks.authenticateApplication,
    globalHooks.restrictToAuthenticatedApplication,
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [globalHooks.queryWithCurrentUserAsRoomMember],
  get: [globalHooks.restrictToRoomMember],
  create: [
      globalHooks.associateCurrentApplication,
      globalHooks.associateCurrentUserAsMember
  ],
  update: [hooks.disable('external')],
  patch: [
    globalHooks.restrictToCurrentApplication,
    globalHooks.restrictToRoomAction
  ],
  remove: [hooks.disable('external')]
};

exports.after = {
  all: [hooks.remove('application')],
  find: [hooks.populate('users', {service: 'users'})],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
