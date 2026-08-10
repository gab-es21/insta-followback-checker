import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/categories';
import { useAppState } from '../state/AppContext';
import type { Category } from '../types/instagram';

export function Sidebar() {
  const { state, setActiveCategory, reset } = useAppState();
  const { dataset, activeCategory, status } = state;

  return (
    <aside className="sidebar">
      <h1 className="brand">FollowCheck</h1>
      <nav aria-label="Categories">
        <ul>
          {CATEGORY_ORDER.map((category) => (
            <li key={category}>
              <button
                type="button"
                className={category === activeCategory ? 'category active' : 'category'}
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
      <button type="button" className="upload-new" onClick={reset} disabled={status === 'empty'}>
        Upload New
      </button>
    </aside>
  );
}

function toDatasetKey(category: Category): 'mutual' | 'notFollowingBack' | 'fans' {
  if (category === 'not-following-back') return 'notFollowingBack';
  return category;
}
