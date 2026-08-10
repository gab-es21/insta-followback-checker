import { ErrorBanner } from './ErrorBanner';
import { ExportCsvButton } from './ExportCsvButton';
import { CATEGORY_LABELS } from '../lib/categories';
import { FollowList } from './FollowList';
import { SearchBar } from './SearchBar';
import { UploadZone } from './UploadZone';
import { filterAccounts } from '../lib/search';
import { useAppState } from '../state/AppContext';
import type { Account, Category } from '../types/instagram';

function accountsForCategory(dataset: { mutual: Account[]; notFollowingBack: Account[]; fans: Account[] }, category: Category): Account[] {
  if (category === 'mutual') return dataset.mutual;
  if (category === 'fans') return dataset.fans;
  return dataset.notFollowingBack;
}

export function MainPane() {
  const { state } = useAppState();
  const { status, dataset, errorMessage, activeCategory, searchTerm } = state;

  if (status !== 'loaded' || !dataset) {
    return (
      <main className="main-pane">
        {status === 'error' && errorMessage && <ErrorBanner message={errorMessage} />}
        <UploadZone />
      </main>
    );
  }

  const categoryAccounts = accountsForCategory(dataset, activeCategory);
  const visibleAccounts = filterAccounts(categoryAccounts, searchTerm);

  return (
    <main className="main-pane">
      <header className="main-pane-header">
        <h2>{CATEGORY_LABELS[activeCategory]}</h2>
        <div className="main-pane-controls">
          <SearchBar />
          <ExportCsvButton accounts={visibleAccounts} category={activeCategory} />
        </div>
      </header>
      <FollowList accounts={visibleAccounts} isFiltered={searchTerm.trim().length > 0} />
    </main>
  );
}
