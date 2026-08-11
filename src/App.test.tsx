import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { renderWithProvider } from './test-utils';

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
});
