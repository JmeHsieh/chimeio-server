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
  find: [
    globalHooks.restrictToRoomMember,
    globalHooks.restrictToUndeleted
  ],
  get: [
    auth.restrictToOwner({ownerField: 'user'}),
    globalHooks.restrictToUndeleted
],
  create: [
    globalHooks.restrictToRoomMember,
    globalHooks.associateQueryingRoom,
    globalHooks.associateCurrentApplication,
    auth.associateCurrentUser({idField: '_id', as: 'user'}),
  ],
  update: [hooks.disable('external')],
  patch: [hooks.disable('external')],
  remove: [
    auth.restrictToOwner({ownerField: 'user'}),
    globalHooks.restrictToUndeleted,
    globalHooks.softDelete]
};

exports.after = {
  all: [hooks.remove('deleted', 'application')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
