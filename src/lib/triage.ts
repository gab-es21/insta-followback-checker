import { normalizeUsername } from './normalizeUsername';
import type { Account, TriageMap, TriageStatus, TriageView } from '../types/instagram';

const STORAGE_KEY = 'followcheck:triage';

export const TRIAGE_VIEW_LABELS: Record<TriageView, string> = {
  pending: 'Pending',
  kept: 'Kept',
  unfollowed: 'Unfollowed',
};

export function loadTriage(): TriageMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as TriageMap) : {};
  } catch {
    return {};
  }
}

export function saveTriage(triage: TriageMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triage));
  } catch {
    // Storage can be full or unavailable (private browsing) — triage marks
    // just won't persist across sessions; nothing in-session breaks.
  }
}

export function clearStoredTriage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do — if storage is unavailable there's nothing to clear.
  }
}

export function statusOf(triage: TriageMap, username: string): TriageStatus | undefined {
  return triage[normalizeUsername(username)];
}

export function countByView(accounts: Account[], triage: TriageMap): Record<TriageView, number> {
  const counts: Record<TriageView, number> = { pending: 0, kept: 0, unfollowed: 0 };
  for (const account of accounts) {
    const status = statusOf(triage, account.username);
    counts[status ?? 'pending'] += 1;
  }
  return counts;
}

export function filterByTriageView(accounts: Account[], triage: TriageMap, view: TriageView): Account[] {
  return accounts.filter((account) => (statusOf(triage, account.username) ?? 'pending') === view);
}
