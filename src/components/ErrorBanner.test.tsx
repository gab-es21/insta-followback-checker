import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorBanner } from './ErrorBanner';

describe('ErrorBanner', () => {
  it('renders the message inside an alert region', () => {
    render(<ErrorBanner message="Something broke" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Something broke');
  });
});
