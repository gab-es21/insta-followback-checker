/**
 * Comparison-only key. Never render this — always render `Account.username`
 * so the original exported casing is preserved in the UI/CSV.
 */
export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}
