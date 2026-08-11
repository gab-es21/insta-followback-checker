import { useAppState } from '../state/AppContext';
import { SearchIcon } from './icons';

export function SearchBar() {
  const { state, setSearchTerm } = useAppState();

  return (
    <div className="search-wrap">
      <SearchIcon aria-hidden="true" className="search-icon" />
      <input
        type="search"
        className="search-bar"
        placeholder="Search username…"
        value={state.searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search within this category"
      />
    </div>
  );
}
