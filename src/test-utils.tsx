import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { AppProvider, useAppState } from './state/AppContext';

export function renderWithProvider(ui: ReactElement) {
  return render(<AppProvider>{ui}</AppProvider>);
}

export function fixtureFile(name: string): File {
  const raw = readFileSync(join(process.cwd(), 'fixtures', name), 'utf-8');
  return new File([raw], name, { type: 'application/json' });
}

/** Test-only trigger for AppContext's loadFiles, so tests can reach the "loaded" state. */
export function Loader({ files }: { files: File[] }) {
  const { loadFiles } = useAppState();
  return (
    <button type="button" onClick={() => void loadFiles(files)}>
      load
    </button>
  );
}
