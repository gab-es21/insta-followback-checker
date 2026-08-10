import { parseUploadedFiles } from './parseExport';
import { computeCategories } from './diff';
import type { ParsedDataset } from '../types/instagram';

export async function buildDataset(files: File[]): Promise<ParsedDataset> {
  const { following, followers } = await parseUploadedFiles(files);
  const { mutual, notFollowingBack, fans } = computeCategories(following, followers);
  return { following, followers, mutual, notFollowingBack, fans };
}
