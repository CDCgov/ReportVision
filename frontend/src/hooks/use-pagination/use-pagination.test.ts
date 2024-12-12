import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import usePagination from './index';

describe('usePagination hook', () => {
  const items: number[] = Array.from({ length: 50 }, (_, i) => i + 1); // Sample items [1, 2, ..., 50]

  it('should initialize with the correct state', () => {
    const { result } = renderHook(() => usePagination(items, 10, 1));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.currentItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should navigate to the next page', () => {
    const { result } = renderHook(() => usePagination(items, 10, 1));

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('should navigate to the previous page', () => {
    const { result } = renderHook(() => usePagination(items, 10, 2));

    act(() => {
      result.current.previousPage();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should navigate to the first page', () => {
    const { result } = renderHook(() => usePagination(items, 10, 3));

    act(() => {
      result.current.firstPage();
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentItems).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should navigate to the last page', () => {
    const { result } = renderHook(() => usePagination(items, 10, 1));

    act(() => {
      result.current.lastPage();
    });

    expect(result.current.currentPage).toBe(5);
    expect(result.current.currentItems).toEqual([41, 42, 43, 44, 45, 46, 47, 48, 49, 50]);
  });

  it('should navigate to a specific page', () => {
    const { result } = renderHook(() => usePagination(items, 10, 1));

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.currentItems).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
  });

  it('should generate correct page numbers', () => {
    const { result } = renderHook(() => usePagination(items, 10, 3));

    const pageNumbers = result.current.getPageNumbers(5);
    expect(pageNumbers).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle edge cases for page numbers', () => {
    const { result } = renderHook(() => usePagination(items, 10, 5));

    const pageNumbers = result.current.getPageNumbers(5);
    expect(pageNumbers).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle hasNextPage and hasPreviousPage correctly', () => {
    const { result } = renderHook(() => usePagination(items, 10, 1));

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.hasPreviousPage).toBe(false);

    act(() => {
      result.current.goToPage(5);
    });

    expect(result.current.hasNextPage).toBe(false);
    expect(result.current.hasPreviousPage).toBe(true);
  });
});
