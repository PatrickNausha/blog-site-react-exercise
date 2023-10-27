import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const { data: blogPosts } = useFetchJson({ url: "/posts?page=1" });
  if (blogPosts) {
    const { meta, posts } = blogPosts;
    return (
      <>
        {posts.map(({ title }) => (
          <h1>{title}</h1>
        ))}
      </>
    );
  } else {
    return <>Loading</>;
  }
}

const baseUrl = "https://brivity-react-exercise.herokuapp.com";
function useFetchJson({ url, method = "GET" }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const fetchResult = await fetch(baseUrl + url, { method });
      const json = await fetchResult.json();
      setData(json);
    })();
  }, [method, url]);

  return { data, isLoading, error };
}

export default App;
