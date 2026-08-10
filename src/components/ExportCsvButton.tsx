import { downloadCsv, toCsv } from '../lib/csv';
import type { Account, Category } from '../types/instagram';

interface ExportCsvButtonProps {
  accounts: Account[];
  category: Category;
}

export function ExportCsvButton({ accounts, category }: ExportCsvButtonProps) {
  const handleClick = () => {
    const csv = toCsv(accounts);
    downloadCsv(`${category}.csv`, csv);
  };

  return (
    <button type="button" className="export-csv" onClick={handleClick} disabled={accounts.length === 0}>
      Export CSV
    </button>
  );
}
