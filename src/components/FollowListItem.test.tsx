import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FollowListItem } from './FollowListItem';

const account = { username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1 };

describe('FollowListItem', () => {
  it('renders the username and a link to the Instagram profile', () => {
    render(
      <ul>
        <FollowListItem account={account} onSetTriageStatus={() => {}} />
      </ul>,
    );

    expect(screen.getByText('alice_wonder')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Open @alice_wonder on Instagram' });
    expect(link).toHaveAttribute('href', 'https://www.instagram.com/alice_wonder');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('neither triage button is pressed when there is no status', () => {
    render(
      <ul>
        <FollowListItem account={account} onSetTriageStatus={() => {}} />
      </ul>,
    );

    expect(screen.getByRole('button', { name: 'Mark @alice_wonder as kept' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Mark @alice_wonder as unfollowed' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('marks as kept on click, and as unfollowed when the other button is clicked', () => {
    const onSetTriageStatus = vi.fn();
    render(
      <ul>
        <FollowListItem account={account} onSetTriageStatus={onSetTriageStatus} />
      </ul>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mark @alice_wonder as kept' }));
    expect(onSetTriageStatus).toHaveBeenCalledWith('kept');

    fireEvent.click(screen.getByRole('button', { name: 'Mark @alice_wonder as unfollowed' }));
    expect(onSetTriageStatus).toHaveBeenCalledWith('unfollowed');
  });

  it('clicking the active status again clears it', () => {
    const onSetTriageStatus = vi.fn();
    render(
      <ul>
        <FollowListItem account={account} triageStatus="unfollowed" onSetTriageStatus={onSetTriageStatus} />
      </ul>,
    );

    expect(screen.getByRole('button', { name: 'Mark @alice_wonder as unfollowed' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Mark @alice_wonder as unfollowed' }));
    expect(onSetTriageStatus).toHaveBeenCalledWith(null);
  });
});
