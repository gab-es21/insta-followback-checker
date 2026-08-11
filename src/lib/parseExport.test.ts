import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ParseError } from './errors';
import { mergeFollowersFiles, parseFollowersJson, parseFollowingJson, parseUploadedFiles } from './parseExport';

function fixture(name: string): string {
  return readFileSync(join(process.cwd(), 'fixtures', name), 'utf-8');
}

function fixtureFile(name: string): File {
  return new File([fixture(name)], name, { type: 'application/json' });
}

describe('parseFollowingJson', () => {
  it('flattens relationships_following into accounts', () => {
    const accounts = parseFollowingJson(fixture('following.json'), 'following.json');
    expect(accounts).toHaveLength(5);
    expect(accounts.map((a) => a.username)).toContain('SomeUser');
  });

  it('reads the username from the entry title when string_list_data has no value (real export shape)', () => {
    const raw = JSON.stringify({
      relationships_following: [
        {
          title: 'real_export_user',
          string_list_data: [{ href: 'https://www.instagram.com/real_export_user', timestamp: 1700000000 }],
        },
      ],
    });
    const accounts = parseFollowingJson(raw, 'following.json');
    expect(accounts).toEqual([
      { username: 'real_export_user', href: 'https://www.instagram.com/real_export_user', timestamp: 1700000000 },
    ]);
  });

  it('prefers string_list_data.value over the entry title when both are present', () => {
    const raw = JSON.stringify({
      relationships_following: [
        {
          title: 'ignored_title',
          string_list_data: [
            { href: 'https://www.instagram.com/preferred', value: 'preferred', timestamp: 1700000000 },
          ],
        },
      ],
    });
    const accounts = parseFollowingJson(raw, 'following.json');
    expect(accounts.map((a) => a.username)).toEqual(['preferred']);
  });

  it('throws ParseError for an unrecognized shape', () => {
    expect(() => parseFollowingJson(fixture('malformed.json'), 'malformed.json')).toThrow(ParseError);
  });

  it('throws ParseError for invalid JSON syntax', () => {
    expect(() => parseFollowingJson('{not valid json', 'broken.json')).toThrow(ParseError);
  });
});

describe('parseFollowersJson', () => {
  it('accepts the wrapped { relationships_followers } shape', () => {
    const accounts = parseFollowersJson(fixture('followers_1.json'), 'followers_1.json');
    expect(accounts).toHaveLength(4);
  });

  it('accepts the bare top-level array shape', () => {
    const accounts = parseFollowersJson(fixture('followers_flat.json'), 'followers_flat.json');
    expect(accounts).toEqual([{ username: 'flat_user', href: 'https://www.instagram.com/flat_user', timestamp: 1698000000 }]);
  });

  it('throws ParseError for an unrecognized shape', () => {
    expect(() => parseFollowersJson(fixture('malformed.json'), 'malformed.json')).toThrow(ParseError);
  });
});

describe('mergeFollowersFiles', () => {
  it('de-dupes by normalized username across files, first-seen casing wins', () => {
    const list1 = parseFollowersJson(fixture('followers_1.json'), 'followers_1.json');
    const list2 = parseFollowersJson(fixture('followers_2.json'), 'followers_2.json');
    const merged = mergeFollowersFiles([list1, list2]);

    expect(merged).toHaveLength(6);
    const gigi = merged.find((a) => a.username === 'gigi_dup');
    expect(gigi?.timestamp).toBe(1699000300);
  });
});

describe('parseUploadedFiles', () => {
  it('parses loose following.json + multiple followers_N.json files', async () => {
    const { following, followers } = await parseUploadedFiles([
      fixtureFile('following.json'),
      fixtureFile('followers_1.json'),
      fixtureFile('followers_2.json'),
    ]);

    expect(following).toHaveLength(5);
    expect(followers).toHaveLength(6);
  });

  it('throws ParseError when following.json is missing', async () => {
    await expect(parseUploadedFiles([fixtureFile('followers_1.json')])).rejects.toThrow(ParseError);
  });

  it('throws ParseError when no followers_*.json is present', async () => {
    await expect(parseUploadedFiles([fixtureFile('following.json')])).rejects.toThrow(ParseError);
  });
});
