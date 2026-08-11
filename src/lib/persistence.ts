import type { ParsedDataset } from '../types/instagram';

const REMEMBER_KEY = 'followcheck:remember-session';
const DATASET_KEY = 'followcheck:dataset';

/** Whether the parsed export and triage marks should survive a refresh. Off by default. */
export function loadRememberSession(): boolean {
  try {
    return localStorage.getItem(REMEMBER_KEY) === 'true';
  } catch {
    return false;
  }
}

export function saveRememberSession(remember: boolean): void {
  try {
    localStorage.setItem(REMEMBER_KEY, String(remember));
  } catch {
    // No-op — the preference just won't stick across sessions either.
  }
}

export function loadStoredDataset(): ParsedDataset | null {
  try {
    const raw = localStorage.getItem(DATASET_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as ParsedDataset) : null;
  } catch {
    return null;
  }
}

export function saveStoredDataset(dataset: ParsedDataset): void {
  try {
    localStorage.setItem(DATASET_KEY, JSON.stringify(dataset));
  } catch {
    // Storage can be full (a very large export) — it just won't survive a refresh this time.
  }
}

export function clearStoredDataset(): void {
  try {
    localStorage.removeItem(DATASET_KEY);
  } catch {
    // Nothing to do.
  }
}
