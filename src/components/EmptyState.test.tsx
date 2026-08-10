import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the given message', () => {
    render(<EmptyState message="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });
});
