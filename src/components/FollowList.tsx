import { EmptyState } from './EmptyState';
import { FollowListItem } from './FollowListItem';
import type { Account } from '../types/instagram';

interface FollowListProps {
  accounts: Account[];
  isFiltered: boolean;
}

export function FollowList({ accounts, isFiltered }: FollowListProps) {
  if (accounts.length === 0) {
    return (
      <EmptyState message={isFiltered ? 'No accounts match your search.' : 'No accounts in this category.'} />
    );
  }

  return (
    <ul className="follow-list">
      {accounts.map((account) => (
        <FollowListItem key={account.username} account={account} />
      ))}
    </ul>
  );
}
