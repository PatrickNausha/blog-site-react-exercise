import { useRef, useEffect, useState } from "react";
import "./App.css";

function App() {
  const { data: blogPosts, loadNextPage } = usePagedFetch({
    path: "/posts",
    mapResponseToPage: (response) => response.posts,
  });
  const infiniteScrollTriggerRef = useInfiniteScrollTrigger(loadNextPage);
  const posts = blogPosts ?? [];
  return (
    <div>
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
      <div ref={infiniteScrollTriggerRef}>Loading ...</div>
    </div>
  );
}

const baseUrl = "https://brivity-react-exercise.herokuapp.com";
function usePagedFetch({ path, mapResponseToPage }) {
  const [data, setData] = useState(null);
  const currentRequest = useRef(null);
  const nextPage = useRef(1);
  const [error, setError] = useState(null); // TODO: handle errors

  const loadNextPage = async () => {
    if (currentRequest.current) {
      return;
    }

    try {
      currentRequest.current = fetch(
        `${baseUrl}${path}?page=${nextPage.current}`
      );
      const fetchResult = await currentRequest.current;
      const json = await fetchResult.json();
      setData((previous) => [...(previous ?? []), ...mapResponseToPage(json)]);
    } finally {
      currentRequest.current = null;
    }
  };

  console.log({ data });
  return { data, error, loadNextPage };
}

function PostPreview({ post }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <h3>by {post.user.display_name}</h3>
    </div>
  );
}

function useInfiniteScrollTrigger(loadNextPage) {
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

export default App;
