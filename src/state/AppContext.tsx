import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { buildDataset } from '../lib/dataset';
import { ParseError } from '../lib/errors';
import { normalizeUsername } from '../lib/normalizeUsername';
import {
  clearStoredDataset,
  loadRememberSession,
  loadStoredDataset,
  saveRememberSession,
  saveStoredDataset,
} from '../lib/persistence';
import { clearStoredTriage, loadTriage, saveTriage } from '../lib/triage';
import type { Category, ParsedDataset, TriageMap, TriageStatus, TriageView } from '../types/instagram';

type Status = 'empty' | 'loading' | 'loaded' | 'error';

interface State {
  status: Status;
  dataset: ParsedDataset | null;
  errorMessage: string | null;
  activeCategory: Category;
  searchTerm: string;
  showHowTo: boolean;
  triage: TriageMap;
  triageView: TriageView;
  rememberSession: boolean;
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; dataset: ParsedDataset }
  | { type: 'LOAD_ERROR'; message: string }
  | { type: 'RESET' }
  | { type: 'ERASE_DATA' }
  | { type: 'SET_CATEGORY'; category: Category }
  | { type: 'SET_SEARCH'; term: string }
  | { type: 'SHOW_HOWTO' }
  | { type: 'HIDE_HOWTO' }
  | { type: 'SET_TRIAGE_VIEW'; view: TriageView }
  | { type: 'SET_TRIAGE_STATUS'; username: string; status: TriageStatus | null }
  | { type: 'SET_REMEMBER_SESSION'; remember: boolean };

const initialState: State = {
  status: 'empty',
  dataset: null,
  errorMessage: null,
  activeCategory: 'not-following-back',
  searchTerm: '',
  showHowTo: false,
  triage: {},
  triageView: 'pending',
  rememberSession: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', errorMessage: null, showHowTo: false };
    case 'LOAD_SUCCESS':
      return {
        ...state,
        status: 'loaded',
        dataset: action.dataset,
        errorMessage: null,
        searchTerm: '',
        triageView: 'pending',
      };
    case 'LOAD_ERROR':
      return { ...state, status: 'error', errorMessage: action.message };
    case 'RESET':
      // Triage decisions (and the remember preference) are about Instagram
      // accounts, not the currently loaded export — keep them across a reset
      // instead of wiping to initialState.
      return { ...initialState, triage: state.triage, rememberSession: state.rememberSession };
    case 'ERASE_DATA':
      // Unlike RESET, this really does start over: the loaded export AND every
      // kept/unfollowed mark are gone. The remember preference itself survives
      // (it's a UI setting, not data), but there's nothing left for it to save.
      return { ...initialState, rememberSession: state.rememberSession };
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category, searchTerm: '', showHowTo: false, triageView: 'pending' };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.term };
    case 'SHOW_HOWTO':
      return { ...state, showHowTo: true };
    case 'HIDE_HOWTO':
      return { ...state, showHowTo: false };
    case 'SET_TRIAGE_VIEW':
      return { ...state, triageView: action.view };
    case 'SET_TRIAGE_STATUS': {
      const key = normalizeUsername(action.username);
      const triage = { ...state.triage };
      if (action.status === null) {
        delete triage[key];
      } else {
        triage[key] = action.status;
      }
      return { ...state, triage };
    }
    case 'SET_REMEMBER_SESSION':
      // Turning this off must really discard things, not just stop saving new
      // marks — otherwise old in-memory marks from earlier this session (or
      // restored from storage at mount) can silently resurface after a Reset.
      return action.remember ? { ...state, rememberSession: true } : { ...state, rememberSession: false, triage: {} };
    default:
      return state;
  }
}

interface AppContextValue {
  state: State;
  loadFiles: (files: File[]) => Promise<void>;
  setActiveCategory: (category: Category) => void;
  setSearchTerm: (term: string) => void;
  reset: () => void;
  eraseData: () => void;
  openHowTo: () => void;
  closeHowTo: () => void;
  setTriageView: (view: TriageView) => void;
  setTriageStatus: (username: string, status: TriageStatus | null) => void;
  setRememberSession: (remember: boolean) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const rememberSession = loadRememberSession();
    if (!rememberSession) return { ...init, rememberSession };

    const storedDataset = loadStoredDataset();
    const status: Status = storedDataset ? 'loaded' : 'empty';
    return {
      ...init,
      rememberSession,
      triage: loadTriage(),
      dataset: storedDataset,
      status,
    };
  });

  // The remember-session preference itself always persists — it's just a UI
  // setting, not the account-level data it gates.
  useEffect(() => {
    saveRememberSession(state.rememberSession);
  }, [state.rememberSession]);

  useEffect(() => {
    if (state.rememberSession) {
      saveTriage(state.triage);
    } else {
      clearStoredTriage();
    }
  }, [state.triage, state.rememberSession]);

  useEffect(() => {
    if (state.rememberSession && state.dataset) {
      saveStoredDataset(state.dataset);
    } else {
      clearStoredDataset();
    }
  }, [state.dataset, state.rememberSession]);

  const loadFiles = useCallback(async (files: File[]) => {
    dispatch({ type: 'LOAD_START' });
    try {
      const dataset = await buildDataset(files);
      dispatch({ type: 'LOAD_SUCCESS', dataset });
    } catch (err) {
      const message = err instanceof ParseError ? err.message : 'Something went wrong reading those files.';
      dispatch({ type: 'LOAD_ERROR', message });
    }
  }, []);

  const setActiveCategory = useCallback((category: Category) => {
    dispatch({ type: 'SET_CATEGORY', category });
  }, []);

  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH', term });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const eraseData = useCallback(() => {
    dispatch({ type: 'ERASE_DATA' });
  }, []);

  const openHowTo = useCallback(() => {
    dispatch({ type: 'SHOW_HOWTO' });
  }, []);

  const closeHowTo = useCallback(() => {
    dispatch({ type: 'HIDE_HOWTO' });
  }, []);

  const setTriageView = useCallback((view: TriageView) => {
    dispatch({ type: 'SET_TRIAGE_VIEW', view });
  }, []);

  const setTriageStatus = useCallback((username: string, status: TriageStatus | null) => {
    dispatch({ type: 'SET_TRIAGE_STATUS', username, status });
  }, []);

  const setRememberSession = useCallback((remember: boolean) => {
    dispatch({ type: 'SET_REMEMBER_SESSION', remember });
  }, []);

  const value = useMemo(
    () => ({
      state,
      loadFiles,
      setActiveCategory,
      setSearchTerm,
      reset,
      eraseData,
      openHowTo,
      closeHowTo,
      setTriageView,
      setTriageStatus,
      setRememberSession,
    }),
    [
      state,
      loadFiles,
      setActiveCategory,
      setSearchTerm,
      reset,
      eraseData,
      openHowTo,
      closeHowTo,
      setTriageView,
      setTriageStatus,
      setRememberSession,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within an AppProvider');
  return ctx;
}
