import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/categories';
import { useAppState } from '../state/AppContext';
import { InfoIcon, LockIcon } from './icons';
import type { Category } from '../types/instagram';

export function Sidebar() {
  const { state, setActiveCategory, reset, openHowTo } = useAppState();
  const { dataset, activeCategory, status } = state;

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span className="brand-name">FollowCheck</span>
      </div>
      <nav aria-label="Categories">
        <ul>
          {CATEGORY_ORDER.map((category) => (
            <li key={category}>
              <button
                type="button"
                className={`category category-${category}${category === activeCategory ? ' active' : ''}`}
                onClick={() => setActiveCategory(category)}
                aria-current={category === activeCategory}
              >
                <span className="dot" aria-hidden="true" />
                <span className="category-label">{CATEGORY_LABELS[category]}</span>
                <span className="category-count">{dataset ? dataset[toDatasetKey(category)].length : '—'}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-card">
          <p>
            Drop your Instagram data export here — the full ZIP, or the loose <code>following.json</code> and{' '}
            <code>followers_*.json</code> files from <code>connections/followers_and_following/</code>.
          </p>
          <p className="footer-privacy">
            <LockIcon aria-hidden="true" />
            Everything is processed in your browser. Nothing is ever uploaded anywhere.
          </p>
        </div>
        <button type="button" className="how-to-link" onClick={openHowTo}>
          <InfoIcon aria-hidden="true" />
          How to export your data
        </button>
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
