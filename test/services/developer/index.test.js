'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('developer service', () => {
  it('registered the developers service', () => {
    assert.ok(app.service('developers'));
  });
});
