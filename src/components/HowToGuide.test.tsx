import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HowToGuide } from './HowToGuide';

describe('HowToGuide', () => {
  it('renders the export steps and calls onBack when the back button is clicked', () => {
    const onBack = vi.fn();
    render(<HowToGuide onBack={onBack} />);

    expect(screen.getByRole('heading', { name: 'How to get your Instagram data' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);

    fireEvent.click(screen.getByRole('button', { name: /Back/ }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
