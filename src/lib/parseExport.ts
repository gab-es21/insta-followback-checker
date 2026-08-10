import JSZip from 'jszip';
import { ParseError } from './errors';
import { normalizeUsername } from './normalizeUsername';
import type { Account, FollowersExportShape, FollowingExportShape, RelationshipEntry } from '../types/instagram';

const FOLLOWING_FILENAME = /following\.json$/i;
const FOLLOWERS_FILENAME = /followers_\d+\.json$/i;

function flattenEntries(entries: RelationshipEntry[]): Account[] {
  const accounts: Account[] = [];
  for (const entry of entries) {
    for (const item of entry.string_list_data ?? []) {
      accounts.push({ username: item.value, href: item.href, timestamp: item.timestamp });
    }
  }
  return accounts;
}

function parseJson(raw: string, filename: string): unknown {
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new ParseError(`Could not parse ${filename}: not valid JSON.`, err);
  }
}

export function parseFollowingJson(raw: string, filename: string): Account[] {
  const parsed = parseJson(raw, filename) as Partial<FollowingExportShape> | null;
  if (!parsed || !Array.isArray(parsed.relationships_following)) {
    throw new ParseError(`Could not read ${filename}: missing "relationships_following" array.`);
  }
  return flattenEntries(parsed.relationships_following);
}

export function parseFollowersJson(raw: string, filename: string): Account[] {
  const parsed = parseJson(raw, filename) as FollowersExportShape | null;
  const entries = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.relationships_followers)
      ? parsed.relationships_followers
      : null;
  if (entries === null) {
    throw new ParseError(`Could not read ${filename}: unrecognized followers file shape.`);
  }
  return flattenEntries(entries);
}

/**
 * Merges followers_1.json, followers_2.json, etc. and de-dupes by normalized
 * username (first-seen casing wins) in case the same account appears in more
 * than one file, or twice within one file.
 */
export function mergeFollowersFiles(fileLists: Account[][]): Account[] {
  const byKey = new Map<string, Account>();
  for (const list of fileLists) {
    for (const account of list) {
      const key = normalizeUsername(account.username);
      if (!byKey.has(key)) byKey.set(key, account);
    }
  }
  return [...byKey.values()];
}

interface NamedFile {
  name: string;
  text: () => Promise<string>;
}

async function extractZipEntries(file: File): Promise<NamedFile[]> {
  const zip = await JSZip.loadAsync(file);
  const entries: NamedFile[] = [];
  zip.forEach((_path, zipEntry) => {
    if (zipEntry.dir) return;
    if (FOLLOWING_FILENAME.test(zipEntry.name) || FOLLOWERS_FILENAME.test(zipEntry.name)) {
      entries.push({ name: zipEntry.name, text: () => zipEntry.async('string') });
    }
  });
  return entries;
}

export async function parseUploadedFiles(files: File[]): Promise<{ following: Account[]; followers: Account[] }> {
  const namedFiles: NamedFile[] =
    files.length === 1 && files[0].name.toLowerCase().endsWith('.zip')
      ? await extractZipEntries(files[0])
      : files.map((file) => ({ name: file.name, text: () => file.text() }));

  const followingFile = namedFiles.find((f) => FOLLOWING_FILENAME.test(f.name));
  const followersFiles = namedFiles
    .filter((f) => FOLLOWERS_FILENAME.test(f.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  if (!followingFile) {
    throw new ParseError(
      'No following.json found. Upload the Instagram export ZIP, or the loose JSON files from connections/followers_and_following/.',
    );
  }
  if (followersFiles.length === 0) {
    throw new ParseError(
      'No followers_*.json found. Upload the Instagram export ZIP, or the loose JSON files from connections/followers_and_following/.',
    );
  }

  const following = parseFollowingJson(await followingFile.text(), followingFile.name);
  const followersLists = await Promise.all(
    followersFiles.map(async (f) => parseFollowersJson(await f.text(), f.name)),
  );
  const followers = mergeFollowersFiles(followersLists);

  return { following, followers };
}
