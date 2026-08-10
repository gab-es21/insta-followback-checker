export interface StringListEntry {
  href: string;
  value: string;
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
