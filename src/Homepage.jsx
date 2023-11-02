import { PostPreview } from "./PostPreview";
import { usePagedData, useInfiniteScrollTrigger } from "./infinite-scroll";
import { useAuthentication } from "./authentication";
import "./App.css";
import { restApiBaseUrl } from "./config";
import { Link } from "react-router-dom";

export function Homepage() {
  const { currentUser } = useAuthentication();

  // TODO: Detect last page.
  const { data: blogPosts, loadNextPage } = usePagedData(async function (page) {
    const fetchResult = await fetch(`${restApiBaseUrl}/posts?page=${page}`);
    const json = await fetchResult.json();
    const newPage = json.posts;
    return newPage;
  });
  const infiniteScrollTriggerRef = useInfiniteScrollTrigger(loadNextPage);
  const posts = blogPosts ?? [];

  return (
    <>
      {currentUser && <Link to="/posts/create">Create post</Link>}
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
      <div ref={infiniteScrollTriggerRef}>Loading ...</div>
    </>
  );
}
