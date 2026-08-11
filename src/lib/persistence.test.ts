import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearStoredDataset,
  loadRememberSession,
  loadStoredDataset,
  saveRememberSession,
  saveStoredDataset,
} from './persistence';

const dataset = {
  following: [{ username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1 }],
  followers: [],
  mutual: [],
  notFollowingBack: [{ username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1 }],
  fans: [],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadRememberSession / saveRememberSession', () => {
  it('defaults to false when nothing is stored', () => {
    expect(loadRememberSession()).toBe(false);
  });

  it('round-trips through localStorage', () => {
    saveRememberSession(true);
    expect(loadRememberSession()).toBe(true);
  });
});

describe('loadStoredDataset / saveStoredDataset', () => {
  it('round-trips a parsed dataset through localStorage', () => {
    saveStoredDataset(dataset);
    expect(loadStoredDataset()).toEqual(dataset);
  });

  it('returns null when nothing is stored', () => {
    expect(loadStoredDataset()).toBeNull();
  });

  it('returns null for corrupted stored JSON instead of throwing', () => {
    localStorage.setItem('followcheck:dataset', '{not valid json');
    expect(loadStoredDataset()).toBeNull();
  });

  it('does not throw when localStorage.setItem fails (e.g. quota exceeded)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => saveStoredDataset(dataset)).not.toThrow();
  });
});

describe('clearStoredDataset', () => {
  it('removes any stored dataset', () => {
    saveStoredDataset(dataset);
    clearStoredDataset();
    expect(loadStoredDataset()).toBeNull();
  });
});
