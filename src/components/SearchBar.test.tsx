import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SearchBar } from './SearchBar';
import { renderWithProvider } from '../test-utils';

describe('SearchBar', () => {
  it('updates its value as the user types', () => {
    renderWithProvider(<SearchBar />);
    const input = screen.getByLabelText('Search within this category') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'alice' } });

    expect(input.value).toBe('alice');
  });
});
