'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [],
  find: [
    hooks.disable('external')
    // auth.verifyToken(),
    // auth.populateUser(),
    // auth.restrictToAuthenticated()
  ],
  get: [
    hooks.disable('external')
    // auth.verifyToken(),
    // auth.populateUser(),
    // auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
  ],
  create: [
    globalHooks.authenticateApplication,
    globalHooks.restrictToAuthenticatedApplication,
    globalHooks.associateCurrentApplication,
    auth.hashPassword()
  ],
  update: [
    hooks.disable('external')
    // auth.verifyToken(),
    // auth.populateUser(),
    // auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
  ],
  patch: [
    hooks.disable('external')
    // auth.verifyToken(),
    // auth.populateUser(),
    // auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
  ],
  remove: [
    hooks.disable('external')
    // auth.verifyToken(),
    // auth.populateUser(),
    // auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
  ]
};

exports.after = {
  all: [hooks.remove('password', 'application')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
