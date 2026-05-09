/**
 * useMultiSelect — generic hook for managing multi-selection state.
 * Supports toggle, select-all, deselect-all, and shift-click range selection.
 */

import { useState, useCallback, useMemo } from "react";

export interface MultiSelectReturn<T> {
  selected: Set<T>;
  toggle: (item: T) => void;
  select: (item: T) => void;
  deselect: (item: T) => void;
  selectAll: (items: T[]) => void;
  deselectAll: () => void;
  isSelected: (item: T) => boolean;
  selectRange: (from: T, to: T, allItems: T[]) => void;
  setSelected: (items: T[]) => void;
  count: number;
}

export function useMultiSelect<T>(
  initialSelection: T[] = []
): MultiSelectReturn<T> {
  const [selected, setSelectedState] = useState<Set<T>>(
    () => new Set(initialSelection)
  );

  const toggle = useCallback((item: T) => {
    setSelectedState((prev) => {
      const next = new Set(prev);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      return next;
    });
  }, []);

  const select = useCallback((item: T) => {
    setSelectedState((prev) => {
      if (prev.has(item)) return prev;
      const next = new Set(prev);
      next.add(item);
      return next;
    });
  }, []);

  const deselect = useCallback((item: T) => {
    setSelectedState((prev) => {
      if (!prev.has(item)) return prev;
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedState(new Set(items));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedState(new Set());
  }, []);

  const isSelected = useCallback(
    (item: T) => selected.has(item),
    [selected]
  );

  const selectRange = useCallback(
    (from: T, to: T, allItems: T[]) => {
      const fromIdx = allItems.indexOf(from);
      const toIdx = allItems.indexOf(to);
      if (fromIdx === -1 || toIdx === -1) return;

      const start = Math.min(fromIdx, toIdx);
      const end = Math.max(fromIdx, toIdx);
      const rangeItems = allItems.slice(start, end + 1);

      setSelectedState((prev) => {
        const next = new Set(prev);
        rangeItems.forEach((item) => next.add(item));
        return next;
      });
    },
    []
  );

  const setSelected = useCallback((items: T[]) => {
    setSelectedState(new Set(items));
  }, []);

  const count = useMemo(() => selected.size, [selected]);

  return {
    selected,
    toggle,
    select,
    deselect,
    selectAll,
    deselectAll,
    isSelected,
    selectRange,
    setSelected,
    count,
  };
}
