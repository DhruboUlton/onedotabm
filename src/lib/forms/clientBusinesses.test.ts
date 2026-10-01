import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readBusinesses } from './clientBusinesses.ts';

function form(pairs: [string, string][]): FormData {
  const data = new FormData();
  for (const [key, value] of pairs) data.append(key, value);
  return data;
}

test('reads indexed rows in order', () => {
  const result = readBusinesses(
    form([
      ['businesses[1][name]', 'Second'],
      ['businesses[0][name]', 'First'],
      ['businesses[0][website]', 'first.example'],
    ])
  );
  assert.deepEqual(result, [{ name: 'First', website: 'first.example' }, { name: 'Second' }]);
});

test('drops rows without a name, so blank rows cost nothing', () => {
  const result = readBusinesses(
    form([
      ['businesses[0][name]', 'Kept'],
      ['businesses[1][name]', '   '],
      ['businesses[2][industry]', 'Retail'],
    ])
  );
  assert.deepEqual(result, [{ name: 'Kept' }]);
});

test('trims values and ignores unrelated or unknown fields', () => {
  const result = readBusinesses(
    form([
      ['contact_person', 'Rafiq Hasan'],
      ['businesses[0][name]', '  Padded Name  '],
      ['businesses[0][secret]', 'nope'],
      ['businesses[0][notes]', ''],
    ])
  );
  assert.deepEqual(result, [{ name: 'Padded Name' }]);
});

test('returns nothing when no business was entered', () => {
  assert.deepEqual(readBusinesses(form([['email', 'a@b.c']])), []);
});
