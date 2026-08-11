import { ExternalLinkIcon } from './icons';
import type { CSSProperties } from 'react';
import type { Account } from '../types/instagram';

const AVATAR_PALETTE = ['#f77737', '#e1306c', '#833ab4', '#405de6', '#3897f0', '#22c55e', '#f5b942'];

function avatarColor(username: string): string {
  const code = username.toLowerCase().charCodeAt(0) || 0;
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

interface FollowListItemProps {
  account: Account;
  style?: CSSProperties;
}

export function FollowListItem({ account, style }: FollowListItemProps) {
  return (
    <li className="follow-list-item" style={style}>
      <span className="avatar-placeholder" aria-hidden="true" style={{ background: avatarColor(account.username) }}>
        {account.username.charAt(0).toUpperCase()}
      </span>
      <span className="username">{account.username}</span>
      <a
        className="profile-link"
        href={account.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Open @${account.username} on Instagram`}
      >
        <ExternalLinkIcon aria-hidden="true" />
      </a>
    </li>
  );
}
