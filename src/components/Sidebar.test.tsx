import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Sidebar } from './Sidebar';
import { Loader, fixtureFile, renderWithProvider } from '../test-utils';

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

  it('disables "Upload New" until a dataset is loaded, then resets state on click', async () => {
    renderWithProvider(
      <>
        <Loader
          files={[fixtureFile('following.json'), fixtureFile('followers_1.json'), fixtureFile('followers_2.json')]}
        />
        <Sidebar />
      </>,
    );
    expect(screen.getByRole('button', { name: 'Upload New' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'load' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Upload New' })).toBeEnabled());

    fireEvent.click(screen.getByRole('button', { name: 'Upload New' }));

    expect(screen.getByRole('button', { name: 'Upload New' })).toBeDisabled();
  });

  it('always exposes the privacy note and a "How to export your data" entry point', () => {
    renderWithProvider(<Sidebar />);

    expect(screen.getByText(/Everything is processed in your browser/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /How to export your data/ })).toBeInTheDocument();
  });
});
