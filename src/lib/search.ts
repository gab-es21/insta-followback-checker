import { normalizeUsername } from './normalizeUsername';
import type { Account } from '../types/instagram';

export function filterAccounts(accounts: Account[], term: string): Account[] {
  const key = normalizeUsername(term);
  if (!key) return accounts;
  return accounts.filter((account) => normalizeUsername(account.username).includes(key));
}
