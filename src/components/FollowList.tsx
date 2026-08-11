import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { EmptyState } from './EmptyState';
import { FollowListItem } from './FollowListItem';
import type { Account } from '../types/instagram';

const ROW_HEIGHT = 64;

interface FollowListProps {
  accounts: Account[];
  isFiltered: boolean;
}

export function FollowList({ accounts, isFiltered }: FollowListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: accounts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    initialRect: { width: 800, height: 600 },
  });

  if (accounts.length === 0) {
    return <EmptyState message={isFiltered ? 'No accounts match your search.' : 'No accounts in this category.'} />;
  }

  return (
    <div className="follow-list-scroll" ref={scrollRef}>
      <ul className="follow-list" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <FollowListItem
            key={accounts[virtualRow.index].username}
            account={accounts[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualRow.size,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </ul>
    </div>
  );
}
