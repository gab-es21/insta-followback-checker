import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { fixtureFile, renderWithProvider } from './test-utils';

describe('App', () => {
  it('renders the sidebar and the main pane', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('FollowCheck')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
  });

  it('opens the how-to guide from the sidebar and returns to the app on back', () => {
    renderWithProvider(<App />);

    fireEvent.click(screen.getByRole('button', { name: /How to export your data/ }));
    expect(screen.getByRole('heading', { name: 'How to get your Instagram data' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
  });

  it('does NOT persist the export or triage marks across a fresh mount by default (remember is off)', async () => {
    const files = [fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')];
    const first = renderWithProvider(<App />);

    expect(screen.getByRole('checkbox', { name: /Save my export and choices/ })).not.toBeChecked();

    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files } });
    await waitFor(() => expect(screen.getByText('charlie_dev')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Mark @charlie_dev as kept' }));
    expect(screen.getByRole('button', { name: /Kept/ })).toHaveTextContent('1');

    first.unmount();
    renderWithProvider(<App />);

    // back to the empty upload screen — nothing was remembered
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
  });

  it('restores the loaded export and triage marks on a fresh mount once "remember" is turned on — no re-upload needed', async () => {
    const files = [fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')];
    const first = renderWithProvider(<App />);

    fireEvent.click(screen.getByRole('checkbox', { name: /Save my export and choices/ }));
    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files } });
    await waitFor(() => expect(screen.getByText('charlie_dev')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Mark @charlie_dev as kept' }));
    expect(screen.getByRole('button', { name: /Kept/ })).toHaveTextContent('1');

    first.unmount();
    renderWithProvider(<App />);

    // straight to the loaded view — no file input interaction at all. charlie_dev
    // is already marked kept, so the default pending view shows dana_writes instead.
    expect(screen.getByRole('checkbox', { name: /Save my export and choices/ })).toBeChecked();
    expect(screen.getByRole('heading', { name: 'Not Following Back' })).toBeInTheDocument();
    expect(screen.getByText('dana_writes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kept/ })).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button', { name: /Kept/ }));
    expect(screen.getByText('charlie_dev')).toBeInTheDocument();
  });

  it('actively discards stored data the moment "remember" is turned back off, not just stops saving new marks', async () => {
    const files = [fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')];
    renderWithProvider(<App />);

    fireEvent.click(screen.getByRole('checkbox', { name: /Save my export and choices/ }));
    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files } });
    await waitFor(() => expect(screen.getByText('charlie_dev')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Mark @charlie_dev as kept' }));

    expect(localStorage.getItem('followcheck:dataset')).not.toBeNull();
    expect(localStorage.getItem('followcheck:triage')).toBe('{"charlie_dev":"kept"}');

    fireEvent.click(screen.getByRole('checkbox', { name: /Save my export and choices/ }));

    expect(localStorage.getItem('followcheck:dataset')).toBeNull();
    expect(localStorage.getItem('followcheck:triage')).toBeNull();

    // regression: the old in-memory mark must not resurface after a Reset +
    // re-upload just because remember was on earlier in this same session.
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files } });
    await waitFor(() => expect(screen.getByText('charlie_dev')).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /Kept/ })).not.toBeInTheDocument();
  });

  it('keeps triage marks in memory across a Reset, without needing a remount', async () => {
    const files = [fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')];
    renderWithProvider(<App />);

    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files } });
    await waitFor(() => expect(screen.getByText('charlie_dev')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Mark @charlie_dev as kept' }));

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    fireEvent.change(document.querySelector('input[type="file"]') as HTMLInputElement, { target: { files } });

    await waitFor(() => expect(screen.getByRole('button', { name: /Kept/ })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Kept/ })).toHaveTextContent('1');
  });
});
