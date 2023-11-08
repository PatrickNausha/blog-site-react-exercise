import { Link } from "react-router-dom";
import { PostPreview } from "./PostPreview";
import { usePagedData, useInfiniteScrollTrigger } from "./infinite-scroll";
import { restApiBaseUrl } from "./config";
import { useAuthentication } from "./authentication";

export function Homepage() {
  const {
    data: blogPosts,
    loadNextPage,
    hasMore,
  } = usePagedData(async function (page) {
    const fetchResult = await fetch(`${restApiBaseUrl}/posts?page=${page}`);
    const json = await fetchResult.json();
    const newPage = json.posts;
    return newPage;
  });
  const infiniteScrollTriggerRef = useInfiniteScrollTrigger(loadNextPage);
  const { currentUser } = useAuthentication();
  const posts = blogPosts ?? [];

  return (
    <>
      {currentUser && (
        <div className="container">
          <Link className="btn btn-primary" to="/posts/create">
            Create post
          </Link>
        </div>
      )}
      {posts.map((post) => (
        <div key={post.id} className="container border-bottom">
          <PostPreview post={post} />
        </div>
      ))}
      {hasMore && (
        <div className="container" ref={infiniteScrollTriggerRef}>
          Loading ...
        </div>
      )}
    </>
  );
}
