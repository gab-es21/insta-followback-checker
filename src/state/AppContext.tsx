import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { buildDataset } from '../lib/dataset';
import { ParseError } from '../lib/errors';
import type { Category, ParsedDataset } from '../types/instagram';

type Status = 'empty' | 'loading' | 'loaded' | 'error';

interface State {
  status: Status;
  dataset: ParsedDataset | null;
  errorMessage: string | null;
  activeCategory: Category;
  searchTerm: string;
  showHowTo: boolean;
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; dataset: ParsedDataset }
  | { type: 'LOAD_ERROR'; message: string }
  | { type: 'RESET' }
  | { type: 'SET_CATEGORY'; category: Category }
  | { type: 'SET_SEARCH'; term: string }
  | { type: 'SHOW_HOWTO' }
  | { type: 'HIDE_HOWTO' };

const initialState: State = {
  status: 'empty',
  dataset: null,
  errorMessage: null,
  activeCategory: 'not-following-back',
  searchTerm: '',
  showHowTo: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', errorMessage: null, showHowTo: false };
    case 'LOAD_SUCCESS':
      return { ...state, status: 'loaded', dataset: action.dataset, errorMessage: null, searchTerm: '' };
    case 'LOAD_ERROR':
      return { ...state, status: 'error', errorMessage: action.message };
    case 'RESET':
      return initialState;
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category, searchTerm: '', showHowTo: false };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.term };
    case 'SHOW_HOWTO':
      return { ...state, showHowTo: true };
    case 'HIDE_HOWTO':
      return { ...state, showHowTo: false };
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
  openHowTo: () => void;
  closeHowTo: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  const openHowTo = useCallback(() => {
    dispatch({ type: 'SHOW_HOWTO' });
  }, []);

  const closeHowTo = useCallback(() => {
    dispatch({ type: 'HIDE_HOWTO' });
  }, []);

  const value = useMemo(
    () => ({ state, loadFiles, setActiveCategory, setSearchTerm, reset, openHowTo, closeHowTo }),
    [state, loadFiles, setActiveCategory, setSearchTerm, reset, openHowTo, closeHowTo],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within an AppProvider');
  return ctx;
}
