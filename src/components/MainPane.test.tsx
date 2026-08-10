import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MainPane } from './MainPane';
import { Loader, fixtureFile, renderWithProvider } from '../test-utils';

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
});
