import { describe, expect, it } from 'vitest';
import { filterAccounts } from './search';

const accounts = [
  { username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1 },
  { username: 'Bob_Builder', href: 'https://www.instagram.com/Bob_Builder', timestamp: 2 },
];

describe('filterAccounts', () => {
  it('returns everything for a blank term', () => {
    expect(filterAccounts(accounts, '  ')).toEqual(accounts);
  });

  it('matches case-insensitively on a substring of the username', () => {
    expect(filterAccounts(accounts, 'bob')).toEqual([accounts[1]]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterAccounts(accounts, 'zzz')).toEqual([]);
  });
});
