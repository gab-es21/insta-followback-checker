import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';
import { renderWithProvider } from './test-utils';

describe('App', () => {
  it('renders the sidebar and the main pane', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('FollowCheck')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
  });
});
