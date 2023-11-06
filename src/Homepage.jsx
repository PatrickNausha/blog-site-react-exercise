import { PostPreview } from "./PostPreview";
import { usePagedData, useInfiniteScrollTrigger } from "./infinite-scroll";
import "./App.css";
import { restApiBaseUrl } from "./config";

export function Homepage() {
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
      <div>
        {posts.map((post) => (
          <div>
            <div className="container border-bottom">
              <PostPreview key={post.id} post={post} />
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="container" ref={infiniteScrollTriggerRef}>
          Loading ...
        </div>
      </div>
    </>
  );
}
