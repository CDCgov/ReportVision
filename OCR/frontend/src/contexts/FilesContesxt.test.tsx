import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { FilesProvider, useFiles } from './FilesContext';

describe('FilesContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FilesProvider>{children}</FilesProvider>
  );

  it('should add a file', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });

    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    act(() => {
      result.current.addFile(file);
    });

    expect(result.current.files).toContain(file);
  });

  it('should remove a file', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });

    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });

    act(() => {
      result.current.addFile(file);
      result.current.removeFile('hello.pdf');
    });

    expect(result.current.files).not.toContain(file);
  });

  it('should clear all files', () => {
    const { result } = renderHook(() => useFiles(), { wrapper });

    const file1 = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    const file2 = new File(['world'], 'world.pdf', { type: 'application/pdf' });

    act(() => {
      result.current.addFile(file1);
      result.current.addFile(file2);
      result.current.clearFiles();
    });

    expect(result.current.files).toHaveLength(0);
  });
});
