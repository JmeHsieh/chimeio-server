'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [],
  find: [hooks.disable('external')],
  get: [
    globalHooks.authenticateDeveloper,
    globalHooks.restrictToAuthenticatedDeveloper,
    globalHooks.restrictToCurrentDeveloper],
  create: [
    auth.hashPassword(),
    globalHooks.generateDeveloperToken],
  update: [hooks.disable('external')],
  patch: [hooks.disable('external')],
  remove: [hooks.disable('external')]
};

exports.after = {
  all: [hooks.remove('password')],
  find: [hooks.remove('token')],
  get: [hooks.remove('token')],
  create: [hooks.remove('token')],
  update: [hooks.remove('token')],
  patch: [hooks.remove('token')],
  remove: [hooks.remove('token')]
};
