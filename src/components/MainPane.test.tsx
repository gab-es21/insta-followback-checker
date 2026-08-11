import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MainPane } from './MainPane';
import { Loader, Marker, fixtureFile, renderWithProvider } from '../test-utils';
import { useAppState } from '../state/AppContext';
import type { TriageView } from '../types/instagram';

function ViewSwitcher({ view }: { view: TriageView }) {
  const { setTriageView } = useAppState();
  return (
    <button type="button" onClick={() => setTriageView(view)}>
      switch to {view}
    </button>
  );
}

describe('MainPane', () => {
  it('shows the upload zone before any data is loaded', () => {
    renderWithProvider(<MainPane />);
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
  });

  it('shows the category header, search bar, and follow list once data is loaded', async () => {
    renderWithProvider(
      <>
        <Loader
          files={[fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')]}
        />
        <MainPane />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'load' }));

    await waitFor(() => expect(screen.getByText('Not Following Back')).toBeInTheDocument());
    expect(screen.getByLabelText('Search within this category')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeInTheDocument();
  });

  it('shows an error banner alongside the upload zone when loading fails', async () => {
    renderWithProvider(
      <>
        <Loader files={[fixtureFile('followers_1.json')]} />
        <MainPane />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'load' }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
  });

  it('filters the visible list by triage view, and reports once everything is reviewed', async () => {
    renderWithProvider(
      <>
        <Loader
          files={[fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')]}
        />
        <Marker username="charlie_dev" status="kept" />
        <Marker username="dana_writes" status="unfollowed" />
        <ViewSwitcher view="kept" />
        <ViewSwitcher view="unfollowed" />
        <ViewSwitcher view="pending" />
        <MainPane />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'load' }));
    await waitFor(() => expect(screen.getByText('charlie_dev')).toBeInTheDocument());
    expect(screen.getByText('dana_writes')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'mark charlie_dev kept' }));
    fireEvent.click(screen.getByRole('button', { name: 'mark dana_writes unfollowed' }));

    expect(screen.getByText("You've reviewed everyone in this category.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'switch to kept' }));
    expect(screen.getByText('charlie_dev')).toBeInTheDocument();
    expect(screen.queryByText('dana_writes')).not.toBeInTheDocument();
    expect(screen.getByText('Not Following Back · Kept')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'switch to unfollowed' }));
    expect(screen.getByText('dana_writes')).toBeInTheDocument();
    expect(screen.queryByText('charlie_dev')).not.toBeInTheDocument();
  });
});
