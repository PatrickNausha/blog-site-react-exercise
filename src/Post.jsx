import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { restApiBaseUrl, dateFormat } from "./config";
import {
  usePagedFetch as usePagedData,
  useInfiniteScrollTrigger,
} from "./infinite-scroll";
import { useAuthentication } from "./authentication";

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
  } = usePagedData(async function (page) {
    const fetchResult = await fetch(
      `${restApiBaseUrl}/posts/${postId}/comments?page=${page}`
    );
    const json = await fetchResult.json();
    const newPage = json.comments;
    return newPage;
  });
  const { currentUser, authenticationToken } = useAuthentication();
  const [myNewComments, setMyNewComments] = useState([]);

  async function addComment(commentText) {
    const fetchResult = await fetch(`${restApiBaseUrl}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authenticationToken,
      },
      body: JSON.stringify({
        comment: {
          post_id: postId,
          content: commentText,
        },
      }),
    });
    if (!fetchResult.ok) {
      throw new Error(`Unexpected status. ${fetchResult.status}`);
    }

    const json = fetchResult.json();
    setMyNewComments((previous) => [...previous, json.comment]);
  }

  const comments = [...(postComments ?? []), ...myNewComments];
  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
      {hasMore && (
        <button
          onClick={() => {
            // TODO: Prevent reloading new comments
            loadNextPage();
          }}
        >
          Show more comments
        </button>
      )}
      {currentUser && <NewComment addComment={addComment} />}
    </>
  );
}

function NewComment({ addComment }) {
  const textAreaRef = useRef();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent browser form submission.
        addComment(textAreaRef.current.value);
      }}
    >
      <textarea ref={textAreaRef} placeholder="Add comment ..."></textarea>
      <button>Add comment</button>
    </form>
  );
}
