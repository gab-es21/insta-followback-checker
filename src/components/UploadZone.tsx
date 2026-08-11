import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { useAppState } from '../state/AppContext';
import { UploadCloudIcon } from './icons';

export function UploadZone() {
  const { state, loadFiles } = useAppState();
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isLoading = state.status === 'loading';

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    void loadFiles([...fileList]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className={isDragging ? 'upload-zone dragging' : 'upload-zone'}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {isLoading ? (
        <p>Reading your export…</p>
      ) : (
        <>
          <UploadCloudIcon aria-hidden="true" className="upload-icon" />
          <h2>Upload your export</h2>
          <p className="upload-hint">Drag and drop your files here, or choose them manually.</p>
          <button type="button" onClick={() => inputRef.current?.click()}>
            Choose files
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".zip,.json"
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </>
      )}
    </div>
  );
}
