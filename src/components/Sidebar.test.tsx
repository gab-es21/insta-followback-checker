import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar } from './Sidebar';
import { Loader, Marker, fixtureFile, renderWithProvider } from '../test-utils';

describe('Sidebar', () => {
  it('renders every category with a placeholder count before data is loaded', () => {
    renderWithProvider(<Sidebar />);

    expect(screen.getByText('Not Following Back')).toBeInTheDocument();
    expect(screen.getByText('Mutual')).toBeInTheDocument();
    expect(screen.getByText('Fans')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(3);
  });

  it('marks "Not Following Back" active by default and switches on click', () => {
    renderWithProvider(<Sidebar />);
    const notFollowingBack = screen.getByRole('button', { name: /Not Following Back/ });
    const mutual = screen.getByRole('button', { name: /Mutual/ });
    expect(notFollowingBack).toHaveAttribute('aria-current', 'true');

    fireEvent.click(mutual);

    expect(mutual).toHaveAttribute('aria-current', 'true');
    expect(notFollowingBack).toHaveAttribute('aria-current', 'false');
  });

  it('disables "Reset" until a dataset is loaded, then resets state on click', async () => {
    renderWithProvider(
      <>
        <Loader
          files={[fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')]}
        />
        <Sidebar />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'load' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Reset' })).toBeEnabled());

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
  });

  it('always exposes the privacy note and a "How to export your data" entry point', () => {
    renderWithProvider(<Sidebar />);

    expect(screen.getByText(/Everything is processed in your browser/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /How to export your data/ })).toBeInTheDocument();
  });

  it('shows Kept/Unfollowed sub-items with counts once accounts are marked, and lets you drill into them', async () => {
    renderWithProvider(
      <>
        <Loader
          files={[fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')]}
        />
        <Marker username="charlie_dev" status="kept" />
        <Marker username="dana_writes" status="unfollowed" />
        <Sidebar />
      </>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'load' }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Not Following Back/ })).toBeInTheDocument());

    expect(screen.queryByRole('button', { name: /Kept/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'mark charlie_dev kept' }));
    fireEvent.click(screen.getByRole('button', { name: 'mark dana_writes unfollowed' }));

    const notFollowingBack = screen.getByRole('button', { name: /Not Following Back/ });
    expect(notFollowingBack).toHaveTextContent('0');

    const keptItem = screen.getByRole('button', { name: /Kept/ });
    const unfollowedItem = screen.getByRole('button', { name: /Unfollowed/ });
    expect(keptItem).toHaveTextContent('1');
    expect(unfollowedItem).toHaveTextContent('1');
    expect(notFollowingBack).toHaveAttribute('aria-current', 'true');

    fireEvent.click(keptItem);
    expect(keptItem).toHaveAttribute('aria-current', 'true');
    expect(notFollowingBack).toHaveAttribute('aria-current', 'false');
  });
});
