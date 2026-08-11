import { CheckIcon, ExternalLinkIcon, XIcon } from './icons';
import type { CSSProperties } from 'react';
import type { Account, TriageStatus } from '../types/instagram';

const AVATAR_PALETTE = ['#f77737', '#e1306c', '#833ab4', '#405de6', '#3897f0', '#22c55e', '#f5b942'];

function avatarColor(username: string): string {
  const code = username.toLowerCase().charCodeAt(0) || 0;
  return AVATAR_PALETTE[code % AVATAR_PALETTE.length];
}

interface FollowListItemProps {
  account: Account;
  style?: CSSProperties;
  triageStatus?: TriageStatus;
  onSetTriageStatus: (status: TriageStatus | null) => void;
}

export function FollowListItem({ account, style, triageStatus, onSetTriageStatus }: FollowListItemProps) {
  return (
    <li className={triageStatus ? `follow-list-item status-${triageStatus}` : 'follow-list-item'} style={style}>
      <span className="avatar-placeholder" aria-hidden="true" style={{ background: avatarColor(account.username) }}>
        {account.username.charAt(0).toUpperCase()}
      </span>
      <span className="username">{account.username}</span>
      <button
        type="button"
        className={triageStatus === 'kept' ? 'triage-btn kept active' : 'triage-btn kept'}
        onClick={() => onSetTriageStatus(triageStatus === 'kept' ? null : 'kept')}
        aria-pressed={triageStatus === 'kept'}
        aria-label={`Mark @${account.username} as kept`}
        title="Keep following"
      >
        <CheckIcon aria-hidden="true" />
      </button>
      <button
        type="button"
        className={triageStatus === 'unfollowed' ? 'triage-btn unfollowed active' : 'triage-btn unfollowed'}
        onClick={() => onSetTriageStatus(triageStatus === 'unfollowed' ? null : 'unfollowed')}
        aria-pressed={triageStatus === 'unfollowed'}
        aria-label={`Mark @${account.username} as unfollowed`}
        title="Unfollowed"
      >
        <XIcon aria-hidden="true" />
      </button>
      <a
        className="profile-link"
        href={account.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Open @${account.username} on Instagram`}
        title="Open profile"
      >
        <ExternalLinkIcon aria-hidden="true" />
      </a>
    </li>
  );
}
