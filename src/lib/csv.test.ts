import { describe, expect, it } from 'vitest';
import { toCsv } from './csv';

describe('toCsv', () => {
  it('writes a header row plus one row per account', () => {
    const csv = toCsv([
      { username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1700000000 },
      { username: 'bob_builder', href: 'https://www.instagram.com/bob_builder', timestamp: 1700000100 },
    ]);
    const lines = csv.split('\r\n');
    expect(lines[0]).toBe('username,profile_url,followed_since');
    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('alice_wonder,https://www.instagram.com/alice_wonder,2023-11-14T22:13:20.000Z');
  });

  it('escapes fields containing commas or quotes', () => {
    const csv = toCsv([{ username: 'weird,"name', href: 'https://www.instagram.com/weird', timestamp: 0 }]);
    const [, row] = csv.split('\r\n');
    expect(row.startsWith('"weird,""name"')).toBe(true);
  });

  it('returns just the header row for an empty list', () => {
    expect(toCsv([])).toBe('username,profile_url,followed_since');
  });
});
