import type { Account } from '../types/instagram';

function escapeCsvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function toCsv(rows: Account[]): string {
  const header = ['username', 'profile_url', 'followed_since'];
  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push(
      [
        escapeCsvField(row.username),
        escapeCsvField(row.href),
        escapeCsvField(new Date(row.timestamp * 1000).toISOString()),
      ].join(','),
    );
  }
  return lines.join('\r\n');
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
