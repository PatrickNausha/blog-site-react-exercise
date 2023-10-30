import { Outlet } from "react-router-dom";
import { PostPreview } from "./PostPreview";
import { usePagedFetch, useInfiniteScrollTrigger } from "./infinite-scroll";
import "./App.css";

export function Root() {
  return (
    <div>
      <h1>The Best Blog Site Ever</h1>
      <Outlet />
    </div>
  );
}

export function Index() {
  // TODO: Detect last page.
  const { data: blogPosts, loadNextPage } = usePagedFetch({
    path: "/posts",
    mapResponseToPage: (response) => response.posts,
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
