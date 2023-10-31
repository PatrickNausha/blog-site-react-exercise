import { Outlet } from "react-router-dom";
import { PostPreview } from "./PostPreview";
import { usePagedData, useInfiniteScrollTrigger } from "./infinite-scroll";
import "./App.css";
import { useAuthentication } from "./authentication";
import { restApiBaseUrl } from "./config";

export function Root() {
  const { currentUser } = useAuthentication();
  return (
    <div>
      <h1>The Best Blog Site Ever</h1>
      {
        // TODO: hide on sign-in page
        !currentUser && <a href="/sign-in">Sign in</a>
      }
      <Outlet />
    </div>
  );
}

export function Index() {
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
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
      <div ref={infiniteScrollTriggerRef}>Loading ...</div>
    </>
  );
}
