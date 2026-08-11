import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/categories';
import { countByView } from '../lib/triage';
import { useAppState } from '../state/AppContext';
import { InfoIcon, LockIcon, UploadCloudIcon } from './icons';
import type { Category } from '../types/instagram';

export function Sidebar() {
  const { state, setActiveCategory, setTriageView, reset, openHowTo, setRememberSession } = useAppState();
  const { dataset, activeCategory, status, triage, triageView, rememberSession } = state;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name">FollowCheck</span>
      </div>
      <nav aria-label="Categories">
        <ul>
          {CATEGORY_ORDER.map((category) => {
            const categoryAccounts = dataset ? dataset[toDatasetKey(category)] : [];
            const counts = countByView(categoryAccounts, triage);
            const isActiveCategory = category === activeCategory;
            const hasTriageActivity = counts.kept > 0 || counts.unfollowed > 0;

            return (
              <li key={category}>
                <button
                  type="button"
                  className={`category category-${category}${isActiveCategory && triageView === 'pending' ? ' active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                  aria-current={isActiveCategory && triageView === 'pending'}
                >
                  <span className="dot" aria-hidden="true" />
                  <span className="category-label">{CATEGORY_LABELS[category]}</span>
                  <span className="category-count">{dataset ? counts.pending : '—'}</span>
                </button>
                {dataset && hasTriageActivity && (
                  <ul className="triage-subnav">
                    {counts.kept > 0 && (
                      <li>
                        <button
                          type="button"
                          className={
                            isActiveCategory && triageView === 'kept' ? 'triage-subitem active' : 'triage-subitem'
                          }
                          onClick={() => {
                            setActiveCategory(category);
                            setTriageView('kept');
                          }}
                          aria-current={isActiveCategory && triageView === 'kept'}
                        >
                          <span className="triage-subitem-label">Kept</span>
                          <span className="triage-subitem-count">{counts.kept}</span>
                        </button>
                      </li>
                    )}
                    {counts.unfollowed > 0 && (
                      <li>
                        <button
                          type="button"
                          className={
                            isActiveCategory && triageView === 'unfollowed'
                              ? 'triage-subitem active'
                              : 'triage-subitem'
                          }
                          onClick={() => {
                            setActiveCategory(category);
                            setTriageView('unfollowed');
                          }}
                          aria-current={isActiveCategory && triageView === 'unfollowed'}
                        >
                          <span className="triage-subitem-label">Unfollowed</span>
                          <span className="triage-subitem-count">{counts.unfollowed}</span>
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-card">
          <p className="footer-hint">
            <UploadCloudIcon aria-hidden="true" />
            <span>
              Drop your export here — the full ZIP, or the loose <code>following.json</code> and{' '}
              <code>followers_*.json</code> files from <code>connections/followers_and_following/</code>.
            </span>
          </p>
          <p className="footer-hint">
            <LockIcon aria-hidden="true" />
            <span>Everything is processed in your browser. Nothing is ever uploaded anywhere.</span>
          </p>
        </div>

        <div className="sidebar-menu">
          <button type="button" className="menu-item" onClick={openHowTo}>
            <InfoIcon aria-hidden="true" />
            <span>How to export your data</span>
          </button>
          <label className="menu-item remember-toggle">
            <span>Save my export and choices on this browser</span>
            <span className="toggle-track" aria-hidden="true">
              <span className="toggle-thumb" aria-hidden="true" />
            </span>
            <input
              type="checkbox"
              checked={rememberSession}
              onChange={(e) => setRememberSession(e.target.checked)}
            />
          </label>
        </div>

        <button type="button" className="upload-new" onClick={reset} disabled={status === 'empty'}>
          Reset
        </button>
      </div>
    </aside>
  );
}

function toDatasetKey(category: Category): 'mutual' | 'notFollowingBack' | 'fans' {
  if (category === 'not-following-back') return 'notFollowingBack';
  return category;
}
