'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('room service', () => {
  it('registered the rooms service', () => {
    assert.ok(app.service('rooms'));
  });
});
