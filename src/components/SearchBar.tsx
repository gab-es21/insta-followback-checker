import { useAppState } from '../state/AppContext';

export function SearchBar() {
  const { state, setSearchTerm } = useAppState();

  return (
    <input
      type="search"
      className="search-bar"
      placeholder="Search username…"
      value={state.searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      aria-label="Search within this category"
    />
  );
}
