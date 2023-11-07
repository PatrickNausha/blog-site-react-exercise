import { Link } from "react-router-dom";
import { PostPreview } from "./PostPreview";
import { usePagedData, useInfiniteScrollTrigger } from "./infinite-scroll";
import { restApiBaseUrl } from "./config";
import { useAuthentication } from "./authentication";

export function Homepage() {
  // TODO: Detect last page.
  const { data: blogPosts, loadNextPage } = usePagedData(async function (page) {
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
        <div className="container border-bottom">
          <PostPreview key={post.id} post={post} />
        </div>
      ))}
      <div>
        <div className="container" ref={infiniteScrollTriggerRef}>
          Loading ...
        </div>
      </div>
    </>
  );
}
