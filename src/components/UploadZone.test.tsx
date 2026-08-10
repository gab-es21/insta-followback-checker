import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UploadZone } from './UploadZone';
import { fixtureFile, renderWithProvider } from '../test-utils';

describe('UploadZone', () => {
  it('shows the drop instructions and choose-files button by default', () => {
    renderWithProvider(<UploadZone />);
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
  });

  it('toggles a dragging class while a file is dragged over', () => {
    const { container } = renderWithProvider(<UploadZone />);
    const dropzone = container.querySelector('.upload-zone')!;

    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass('dragging');

    fireEvent.dragLeave(dropzone);
    expect(dropzone).not.toHaveClass('dragging');
  });

  it('loads files selected through the file input and reaches the loaded state', async () => {
    renderWithProvider(<UploadZone />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [fixtureFile('following.json'), fixtureFile('followers_1.json')] },
    });

    expect(screen.getByText('Reading your export…')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument());
  });
});
