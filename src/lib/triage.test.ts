import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearStoredTriage, countByView, filterByTriageView, loadTriage, saveTriage, statusOf } from './triage';

const accounts = [
  { username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1 },
  { username: 'Bob_Builder', href: 'https://www.instagram.com/Bob_Builder', timestamp: 2 },
  { username: 'charlie_dev', href: 'https://www.instagram.com/charlie_dev', timestamp: 3 },
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadTriage / saveTriage', () => {
  it('round-trips through localStorage', () => {
    saveTriage({ alice_wonder: 'kept' });
    expect(loadTriage()).toEqual({ alice_wonder: 'kept' });
  });

  it('returns an empty map when nothing is stored', () => {
    expect(loadTriage()).toEqual({});
  });

  it('returns an empty map for corrupted stored JSON instead of throwing', () => {
    localStorage.setItem('followcheck:triage', '{not valid json');
    expect(loadTriage()).toEqual({});
  });

  it('does not throw when localStorage.setItem fails (e.g. private browsing / full storage)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => saveTriage({ alice_wonder: 'kept' })).not.toThrow();
  });
});

describe('clearStoredTriage', () => {
  it('removes any stored triage map', () => {
    saveTriage({ alice_wonder: 'kept' });
    clearStoredTriage();
    expect(loadTriage()).toEqual({});
  });
});

describe('statusOf', () => {
  it('matches usernames case-insensitively', () => {
    expect(statusOf({ bob_builder: 'unfollowed' }, 'Bob_Builder')).toBe('unfollowed');
  });

  it('returns undefined when unmarked', () => {
    expect(statusOf({}, 'alice_wonder')).toBeUndefined();
  });
});

describe('countByView', () => {
  it('buckets accounts into pending/kept/unfollowed', () => {
    const triage = { alice_wonder: 'kept' as const, bob_builder: 'unfollowed' as const };
    expect(countByView(accounts, triage)).toEqual({ pending: 1, kept: 1, unfollowed: 1 });
  });
});

describe('filterByTriageView', () => {
  it('returns only accounts matching the given view', () => {
    const triage = { alice_wonder: 'kept' as const, bob_builder: 'unfollowed' as const };
    expect(filterByTriageView(accounts, triage, 'kept').map((a) => a.username)).toEqual(['alice_wonder']);
    expect(filterByTriageView(accounts, triage, 'unfollowed').map((a) => a.username)).toEqual(['Bob_Builder']);
    expect(filterByTriageView(accounts, triage, 'pending').map((a) => a.username)).toEqual(['charlie_dev']);
  });
});
