import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FollowList } from './FollowList';

const account = { username: 'alice_wonder', href: 'https://www.instagram.com/alice_wonder', timestamp: 1 };

describe('FollowList', () => {
  it('renders a list item per account', () => {
    render(<FollowList accounts={[account]} emptyMessage="unused" triage={{}} onSetTriageStatus={() => {}} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('shows the given empty message when there are no accounts', () => {
    render(<FollowList accounts={[]} emptyMessage="No accounts match your search." triage={{}} onSetTriageStatus={() => {}} />);
    expect(screen.getByText('No accounts match your search.')).toBeInTheDocument();
  });

  it('reflects the triage map on each row and reports status changes with the account username', () => {
    const onSetTriageStatus = vi.fn();
    render(
      <FollowList
        accounts={[account]}
        emptyMessage="unused"
        triage={{ alice_wonder: 'kept' }}
        onSetTriageStatus={onSetTriageStatus}
      />,
    );

    const keptButton = screen.getByRole('button', { name: 'Mark @alice_wonder as kept' });
    expect(keptButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(keptButton);
    expect(onSetTriageStatus).toHaveBeenCalledWith('alice_wonder', null);
  });
});
