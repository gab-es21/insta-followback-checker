import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ExportCsvButton } from './ExportCsvButton';
import { downloadCsv, toCsv } from '../lib/csv';

vi.mock('../lib/csv', () => ({
  toCsv: vi.fn(() => 'username,profile_url,followed_since'),
  downloadCsv: vi.fn(),
}));

const account = { username: 'alice', href: 'https://www.instagram.com/alice', timestamp: 1 };

describe('ExportCsvButton', () => {
  it('is disabled when there are no accounts', () => {
    render(<ExportCsvButton accounts={[]} category="mutual" />);
    expect(screen.getByRole('button', { name: 'Export CSV' })).toBeDisabled();
  });

  it('builds and downloads a CSV named after the category on click', () => {
    render(<ExportCsvButton accounts={[account]} category="fans" />);
    fireEvent.click(screen.getByRole('button', { name: 'Export CSV' }));

    expect(toCsv).toHaveBeenCalledWith([account]);
    expect(downloadCsv).toHaveBeenCalledWith('fans.csv', 'username,profile_url,followed_since');
  });
});
