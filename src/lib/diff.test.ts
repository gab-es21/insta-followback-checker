import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { computeCategories } from './diff';
import { mergeFollowersFiles, parseFollowersJson, parseFollowingJson } from './parseExport';

function fixture(name: string): string {
  return readFileSync(join(process.cwd(), 'fixtures', name), 'utf-8');
}

describe('computeCategories', () => {
  it('buckets fixture accounts into mutual / notFollowingBack / fans, case-insensitively', () => {
    const following = parseFollowingJson(fixture('following.json'), 'following.json');
    const followers = mergeFollowersFiles([
      parseFollowersJson(fixture('followers_1.json'), 'followers_1.json'),
      parseFollowersJson(fixture('followers_2.json'), 'followers_2.json'),
    ]);

    const { mutual, notFollowingBack, fans } = computeCategories(following, followers);

    expect(mutual.map((a) => a.username)).toEqual(['alice_wonder', 'bob_builder', 'SomeUser']);
    expect(notFollowingBack.map((a) => a.username)).toEqual(['charlie_dev', 'dana_writes']);
    expect(fans.map((a) => a.username)).toEqual(['erin_travels', 'frank_music', 'gigi_dup']);
  });

  it('matches usernames case-insensitively while preserving display casing', () => {
    const { mutual } = computeCategories(
      [{ username: 'CoolUser', href: 'https://www.instagram.com/CoolUser', timestamp: 1 }],
      [{ username: 'cooluser', href: 'https://www.instagram.com/cooluser', timestamp: 2 }],
    );
    expect(mutual).toEqual([{ username: 'CoolUser', href: 'https://www.instagram.com/CoolUser', timestamp: 1 }]);
  });
});
