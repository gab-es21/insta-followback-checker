import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildDataset } from './dataset';

function fixtureFile(name: string): File {
  const raw = readFileSync(join(process.cwd(), 'fixtures', name), 'utf-8');
  return new File([raw], name, { type: 'application/json' });
}

describe('buildDataset', () => {
  it('parses an upload and categorizes it into a full ParsedDataset', async () => {
    const dataset = await buildDataset([
      fixtureFile('following.json'),
      fixtureFile('followers_1.json'),
      fixtureFile('followers_2.json'),
    ]);

    expect(dataset.following).toHaveLength(5);
    expect(dataset.followers).toHaveLength(6);
    expect(dataset.mutual.map((a) => a.username)).toEqual(['alice_wonder', 'bob_builder', 'SomeUser']);
    expect(dataset.notFollowingBack.map((a) => a.username)).toEqual(['charlie_dev', 'dana_writes']);
    expect(dataset.fans.map((a) => a.username)).toEqual(['erin_travels', 'frank_music', 'gigi_dup']);
  });
});
