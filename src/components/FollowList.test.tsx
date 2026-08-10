import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FollowList } from './FollowList';

const account = { username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1 };

describe('FollowList', () => {
  it('renders a list item per account', () => {
    render(<FollowList accounts={[account]} isFiltered={false} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('shows a search-specific empty message when filtered', () => {
    render(<FollowList accounts={[]} isFiltered />);
    expect(screen.getByText('No accounts match your search.')).toBeInTheDocument();
  });

  it('shows a generic empty message when not filtered', () => {
    render(<FollowList accounts={[]} isFiltered={false} />);
    expect(screen.getByText('No accounts in this category.')).toBeInTheDocument();
  });
});
