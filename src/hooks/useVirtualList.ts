import { useState, useEffect, useRef, useMemo } from "react";

interface UseVirtualListOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualList<T>(
  items: T[],
  options: UseVirtualListOptions
) {
  const { itemHeight, containerHeight, overscan = 3 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const virtualItems = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      virtualItems: items.slice(startIndex, endIndex + 1).map((item, index) => ({
        item,
        index: startIndex + index,
        offsetTop: (startIndex + index) * itemHeight,
      })),
      totalHeight: items.length * itemHeight,
      startIndex,
      endIndex,
    };
  }, [items, scrollTop, itemHeight, containerHeight, overscan]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    containerRef,
    virtualItems: virtualItems.virtualItems,
    totalHeight: virtualItems.totalHeight,
    handleScroll,
  };
}