import { useState, useRef, useEffect } from "react";
import { restApiBaseUrl } from "./config";

export function usePagedFetch({ path, mapResponseToPage }) {
  const [data, setData] = useState(null);
  const currentRequest = useRef(null);
  const nextPage = useRef(1);
  const [error, setError] = useState(null); // TODO: handle errors
  const hasMore = useRef(true);

  const loadNextPage = async () => {
    if (currentRequest.current || !hasMore.current) {
      return;
    }

    try {
      currentRequest.current = fetch(
        `${restApiBaseUrl}${path}?page=${nextPage.current}`
      );
      const fetchResult = await currentRequest.current;
      const json = await fetchResult.json();
      const newPage = mapResponseToPage(json);
      setData((previous) => [...(previous ?? []), ...newPage]);
      nextPage.current++;
      if (!newPage.length) {
        hasMore.current = false;
      }
    } finally {
      currentRequest.current = null;
    }
  };

  return { data, error, loadNextPage, hasMore: hasMore.current };
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
