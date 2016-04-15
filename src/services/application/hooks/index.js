'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');

exports.before = {
  all: [],
  find: [hooks.disable('external')],
  get: [
    globalHooks.authenticateDeveloper,
    globalHooks.restrictToAuthenticatedDeveloper,
    globalHooks.restrictToCurrentDeveloper
  ],
  create: [
    globalHooks.authenticateDeveloper,
    globalHooks.restrictToAuthenticatedDeveloper,
    globalHooks.associateCurrentDeveloper,
    globalHooks.generateApplicationKeys],
  update: [hooks.disable('external')],
  patch: [hooks.disable('external')],
  remove: [hooks.disable('external')]
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
