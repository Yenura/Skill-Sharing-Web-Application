import { useCallback, useRef, useEffect } from 'react';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 100,
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      }, { rootMargin: `${threshold}px` });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, onLoadMore, threshold]
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { lastElementRef };
}; 