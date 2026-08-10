import type { Account } from '../types/instagram';

export function FollowListItem({ account }: { account: Account }) {
  return (
    <li className="follow-list-item">
      <span className="username">{account.username}</span>
      <a
        className="profile-link"
        href={account.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Open @${account.username} on Instagram`}
      >
        ↗
      </a>
    </li>
  );
}
