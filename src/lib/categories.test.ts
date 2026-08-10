import { describe, expect, it } from 'vitest';
import { CATEGORY_LABELS, CATEGORY_ORDER } from './categories';

describe('categories', () => {
  it('has a label for every category, in the fixed display order', () => {
    expect(CATEGORY_ORDER).toEqual(['not-following-back', 'mutual', 'fans']);
    for (const category of CATEGORY_ORDER) {
      expect(CATEGORY_LABELS[category]).toBeTruthy();
    }
  });
});
