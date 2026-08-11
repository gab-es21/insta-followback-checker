import { ErrorBanner } from './ErrorBanner';
import { ExportCsvButton } from './ExportCsvButton';
import { CATEGORY_LABELS } from '../lib/categories';
import { FollowList } from './FollowList';
import { HowToGuide } from './HowToGuide';
import { SearchBar } from './SearchBar';
import { UploadZone } from './UploadZone';
import { filterAccounts } from '../lib/search';
import { countByView, filterByTriageView, TRIAGE_VIEW_LABELS } from '../lib/triage';
import { useAppState } from '../state/AppContext';
import type { Account, Category, TriageView } from '../types/instagram';

function accountsForCategory(dataset: { mutual: Account[]; notFollowingBack: Account[]; fans: Account[] }, category: Category): Account[] {
  if (category === 'mutual') return dataset.mutual;
  if (category === 'fans') return dataset.fans;
  return dataset.notFollowingBack;
}

function emptyMessageFor(hasSearch: boolean, triageView: TriageView, reviewedCount: number): string {
  if (hasSearch) return 'No accounts match your search.';
  if (triageView === 'kept') return "You haven't marked anyone as kept yet.";
  if (triageView === 'unfollowed') return "You haven't marked anyone as unfollowed yet.";
  return reviewedCount > 0 ? "You've reviewed everyone in this category." : 'No accounts in this category.';
}

export function MainPane() {
  const { state, closeHowTo, setTriageStatus } = useAppState();
  const { status, dataset, errorMessage, activeCategory, searchTerm, showHowTo, triage, triageView } = state;

  if (showHowTo) {
    return (
      <main className="main-pane">
        <HowToGuide onBack={closeHowTo} />
      </main>
    );
  }

  if (status !== 'loaded' || !dataset) {
    return (
      <main className="main-pane">
        {status === 'error' && errorMessage && <ErrorBanner message={errorMessage} />}
        <UploadZone />
      </main>
    );
  }

  const categoryAccounts = accountsForCategory(dataset, activeCategory);
  const viewCounts = countByView(categoryAccounts, triage);
  const triageAccounts = filterByTriageView(categoryAccounts, triage, triageView);
  const visibleAccounts = filterAccounts(triageAccounts, searchTerm);

  const headerLabel =
    triageView === 'pending'
      ? CATEGORY_LABELS[activeCategory]
      : `${CATEGORY_LABELS[activeCategory]} · ${TRIAGE_VIEW_LABELS[triageView]}`;

  return (
    <main className="main-pane">
      <header className="main-pane-header">
        <h2>{headerLabel}</h2>
        <div className="main-pane-controls">
          <SearchBar />
          <ExportCsvButton accounts={visibleAccounts} category={activeCategory} />
        </div>
      </header>
      <FollowList
        accounts={visibleAccounts}
        emptyMessage={emptyMessageFor(searchTerm.trim().length > 0, triageView, viewCounts.kept + viewCounts.unfollowed)}
        triage={triage}
        onSetTriageStatus={setTriageStatus}
      />
    </main>
  );
}
