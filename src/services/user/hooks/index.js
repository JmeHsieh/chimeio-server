'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const errors = require('feathers-errors');

let verifyApplication = (hook, next) => {
  hook.app.service('/applications').find({query: {application: hook.data.application}}, (error, result) => {
    if (error) { return next(error); }
    if (result.total == 0) { return next(new errors.NotFound('application not found')); }
    next();
  });
}

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  create: [
    verifyApplication,
    auth.hashPassword()
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: '_id' })
  ]
};

exports.after = {
  all: [hooks.remove('password')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
