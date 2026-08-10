import type { Category } from '../types/instagram';

export const CATEGORY_LABELS: Record<Category, string> = {
  'not-following-back': 'Not Following Back',
  mutual: 'Mutual',
  fans: 'Fans',
};

export const CATEGORY_ORDER: Category[] = ['not-following-back', 'mutual', 'fans'];
