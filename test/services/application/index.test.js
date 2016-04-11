'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('application service', () => {
  it('registered the applications service', () => {
    assert.ok(app.service('applications'));
  });
});
