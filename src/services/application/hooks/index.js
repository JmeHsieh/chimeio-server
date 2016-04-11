'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const crypto = require('crypto');
const errors = require('feathers-errors');

// find-developer-hook
const tokenField = 'token';
let findDeveloper = (hook, next) => {
  if (hook.type !== 'before') {
    throw new Error(`The 'findDeveloper' hook should only be used as a 'before' hook.`);
  }

  hook.app.service('developers').find({query: {token: hook.data.token}}, (error, result) => {
    if (error) { return next(error); }
    if (result.total === 0) { return next(new errors.NotFound('developer not exists')); }

    let developerID = result.data[0].id;
    Object.assign(hook.data, {developer: developerID});
    console.log('findDeveloper', hook.data);
    next();
  });
}

// generate-keys-hook
const apiKeyField = 'apiKey';
const clientKeyField = 'clientKey';
let generateKeys = (hook) => {
  if (hook.type !== 'before') {
    throw new Error(`The 'generateKeys' hook should only be used as a 'before' hook.`);
  }

  let currentDateString = (new Date()).valueOf().toString();
  let random = Math.random().toString();
  let apiKey = crypto.createHash('sha1').update(random + currentDateString).digest('hex');
  let clientKey = crypto.createHash('sha1').update(currentDateString + random).digest('hex');
  hook.data[apiKeyField] = apiKey;
  hook.data[clientKeyField] = clientKey;
  console.log('generateKeys', hook.data);
}

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [findDeveloper, generateKeys],
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
