'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const crypto = require('crypto');

// custom hooks
const tokenField = 'token';
let generateToken = function(hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'generateToken' hook should only be used as a 'before' hook.`);
  }

  let currentDateString = (new Date()).valueOf().toString();
  let random = Math.random().toString();
  let token = crypto.createHash('sha1').update(random + currentDateString).digest('hex');
  hook.data[tokenField] = token;
}

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [
    auth.hashPassword(),
    generateToken],
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
