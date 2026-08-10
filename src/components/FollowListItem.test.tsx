import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FollowListItem } from './FollowListItem';

describe('FollowListItem', () => {
  it('renders the username and a link to the Instagram profile', () => {
    render(
      <ul>
        <FollowListItem
          account={{ username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1 }}
        />
      </ul>,
    );

    expect(screen.getByText('alice_wonder')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Open @alice_wonder on Instagram' });
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/alice_wonder');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
