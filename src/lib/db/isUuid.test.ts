import { test } from 'node:test';
import assert from 'node:assert/strict';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (value: string) => UUID_PATTERN.test(value);

test('accepts a real id in either case', () => {
  assert.equal(isUuid('e0000000-0000-0000-0000-000000000001'), true);
  assert.equal(isUuid('E0000000-0000-0000-0000-00000000000A'), true);
});

test('rejects the url junk that used to reach Postgres', () => {
  for (const value of ['%60', '`', '<id>', '', 'undefined', 'null', '../admin']) {
    assert.equal(isUuid(value), false, `${value} should not pass`);
  }
});

test('rejects near misses', () => {
  assert.equal(isUuid('e0000000-0000-0000-0000-00000000001'), false); // short
  assert.equal(isUuid('e0000000-0000-0000-0000-0000000000011'), false); // long
  assert.equal(isUuid('g0000000-0000-0000-0000-000000000001'), false); // not hex
  assert.equal(isUuid(' e0000000-0000-0000-0000-000000000001 '), false); // padded
});
