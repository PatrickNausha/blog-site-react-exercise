import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { restApiBaseUrl, dateFormat } from "./config";
import { usePagedFetch, useInfiniteScrollTrigger } from "./infinite-scroll";

export function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    (async () => {
      const fetchResult = await fetch(`${restApiBaseUrl}/posts/${postId}`);
      const json = await fetchResult.json();
      setPost(json.post);
    })();
  }, [postId]);

  if (!post) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <h3>
        by {post.user.display_name} on{" "}
        {dateFormat.format(new Date(post.created_at))}
      </h3>
      {post.body}
      <h4>Comments</h4>
      <Comments postId={post.id} />
    </div>
  );
}

function Comment({ comment }) {
  return (
    <div>
      <h4>{comment.user.display_name}</h4>
      <p>{comment.content}</p>
    </div>
  );
}

function Comments({ postId }) {
  const {
    data: postComments,
    loadNextPage,
    hasMore,
  } = usePagedFetch({
    path: `/posts/${postId}/comments`,
    mapResponseToPage: (response) => response.comments,
  });
  const infiniteScrollTriggerRef = useInfiniteScrollTrigger(loadNextPage);

  const comments = postComments ?? [];
  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      {hasMore && <div ref={infiniteScrollTriggerRef}>Loading ...</div>}
    </>
  );
}
