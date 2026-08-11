import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { EmptyState } from './EmptyState';
import { FollowListItem } from './FollowListItem';
import { statusOf } from '../lib/triage';
import type { Account, TriageMap, TriageStatus } from '../types/instagram';

const ROW_HEIGHT = 64;

interface FollowListProps {
  accounts: Account[];
  emptyMessage: string;
  triage: TriageMap;
  onSetTriageStatus: (username: string, status: TriageStatus | null) => void;
}

export function FollowList({ accounts, emptyMessage, triage, onSetTriageStatus }: FollowListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: accounts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    initialRect: { width: 800, height: 600 },
  });

  if (accounts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="follow-list-scroll" ref={scrollRef}>
      <ul className="follow-list" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const account = accounts[virtualRow.index];
          return (
            <FollowListItem
              key={account.username}
              account={account}
              triageStatus={statusOf(triage, account.username)}
              onSetTriageStatus={(status) => onSetTriageStatus(account.username, status)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualRow.size,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            />
          );
        })}
      </ul>
    </div>
  );
}
