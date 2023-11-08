import { useState, useRef, useEffect } from "react";

export function usePagedData(getPage) {
  const [initialGetPage] = useState(() => getPage); // Don't support changing getPage between renders.
  const [data, setData] = useState(null);
  const currentRequest = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const hasMore = useRef(true);

  useEffect(() => {
    if (!hasMore.current) {
      return;
    }

    (async () => {
      currentRequest.current = initialGetPage(currentPage);
      const newPage = await currentRequest.current;
      setData((previous) => [...(previous ?? []), ...newPage]);
      if (!newPage.length) {
        hasMore.current = false;
      }
      currentRequest.current = null;
    })();
  }, [currentPage, initialGetPage]);

  return {
    data,
    loadNextPage: () => {
      if (!currentRequest.current) {
        setCurrentPage((previous) => previous + 1);
      }
    },
    hasMore: hasMore.current,
  };
}

export function useInfiniteScrollTrigger(loadNextPage) {
  const observerTargetRef = useRef(null);

  useEffect(() => {
    const observerTarget = observerTargetRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { threshold: 0 }
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, [loadNextPage]);

  return observerTargetRef;
}
