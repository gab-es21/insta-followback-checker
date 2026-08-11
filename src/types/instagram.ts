export interface StringListEntry {
  href: string;
  /**
   * Present on followers_*.json entries. Absent on relationships_following
   * entries in real exports — there the username is on the parent
   * RelationshipEntry's `title` instead. See flattenEntries in parseExport.ts.
   */
  value?: string;
  timestamp: number;
}

export interface RelationshipEntry {
  title?: string;
  media_list_data?: unknown[];
  string_list_data: StringListEntry[];
}

export interface FollowingExportShape {
  relationships_following: RelationshipEntry[];
}

/**
 * Meta has shipped followers_N.json as both a bare top-level array and as
 * `{ relationships_followers: [...] }`. Parsing must accept either.
 */
export type FollowersExportShape = RelationshipEntry[] | { relationships_followers: RelationshipEntry[] };

export interface Account {
  username: string;
  href: string;
  timestamp: number;
}

export type Category = 'mutual' | 'not-following-back' | 'fans';

export interface ParsedDataset {
  following: Account[];
  followers: Account[];
  mutual: Account[];
  notFollowingBack: Account[];
  fans: Account[];
}

/** A user's manual decision on an account, persisted locally so it survives across sessions. */
export type TriageStatus = 'kept' | 'unfollowed';

/** Keyed by normalizeUsername(account.username). */
export type TriageMap = Record<string, TriageStatus>;

/** Which slice of a category's accounts is currently shown: the to-do queue, or a decision log. */
export type TriageView = 'pending' | TriageStatus;
