const { test } = require('node:test');
const assert = require('node:assert/strict');

test('basic arithmetic', () => {
  expect(1 + 1).toBe(2);
});