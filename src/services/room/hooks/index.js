'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const errors = require('feathers-errors');

let preprocess = (hook, next) => {
  if (hook.type !== 'before') {
    throw new Error(`The 'preprocess' hook should only be used as a 'before' hook.`);
  }

  // fill application
  let application = hook.params.user.application;
  if (application ===  undefined) { return next(new errors.Conflict('No application for current user')); }
  Object.assign(hook.data, {application: application});

  // set current user as first member
  Object.assign(hook.data, {users: [hook.params.user.id]});

  next();
}

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [],
  get: [],
  create: [preprocess],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
