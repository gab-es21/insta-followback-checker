import { normalizeUsername } from './normalizeUsername';
import type { Account } from '../types/instagram';

interface Categories {
  mutual: Account[];
  notFollowingBack: Account[];
  fans: Account[];
}

function byUsername(a: Account, b: Account): number {
  return a.username.localeCompare(b.username, undefined, { sensitivity: 'base' });
}

/**
 * Buckets accounts into mutual / not-following-back / fans. Building the two
 * Maps below also silently de-dupes any duplicate normalized username within
 * a single list, same first-seen-wins behavior as mergeFollowersFiles.
 */
export function computeCategories(following: Account[], followers: Account[]): Categories {
  const followingByKey = new Map<string, Account>();
  for (const account of following) {
    const key = normalizeUsername(account.username);
    if (!followingByKey.has(key)) followingByKey.set(key, account);
  }

  const followerByKey = new Map<string, Account>();
  for (const account of followers) {
    const key = normalizeUsername(account.username);
    if (!followerByKey.has(key)) followerByKey.set(key, account);
  }

  const mutual: Account[] = [];
  const notFollowingBack: Account[] = [];
  for (const [key, account] of followingByKey) {
    (followerByKey.has(key) ? mutual : notFollowingBack).push(account);
  }

  const fans: Account[] = [];
  for (const [key, account] of followerByKey) {
    if (!followingByKey.has(key)) fans.push(account);
  }

  return {
    mutual: mutual.sort(byUsername),
    notFollowingBack: notFollowingBack.sort(byUsername),
    fans: fans.sort(byUsername),
  };
}
