import { useState, useRef, useEffect } from "react";

export function usePagedFetch(getPage) {
  const [initialGetPage] = useState(() => getPage); // Don't support changing getPage between renders.
  const [data, setData] = useState(null);
  const currentRequest = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null); // TODO: handle errors
  const hasMore = useRef(true);

  useEffect(() => {
    let isCancelled = false;
    if (!hasMore.current) {
      return;
    }

    (async () => {
      currentRequest.current = initialGetPage(currentPage);
      const newPage = await currentRequest.current;
      if (isCancelled) {
        return;
      }
      setData((previous) => [...(previous ?? []), ...newPage]);
      if (!newPage.length) {
        hasMore.current = false;
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, initialGetPage]);

  return {
    data,
    error,
    loadNextPage: () => {
      setCurrentPage((previous) => previous++);
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
