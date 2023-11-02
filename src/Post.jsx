import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { restApiBaseUrl, dateFormat } from "./config";
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

function Comment({ comment, currentUser, deleteComment, editComment }) {
  const isMyComment = comment.user.id === currentUser?.id;
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef();
  return (
    <div>
      <h4>{comment.user.display_name}</h4>
      {isEditing ? (
        <>
          <textarea ref={editorRef} defaultValue={comment.content}></textarea>
          <button
            onClick={() => {
              editComment(comment.id, editorRef.current.value).then(() => {
                setIsEditing(false);
              });
            }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <p>{comment.content}</p>
          {isMyComment && (
            <>
              <button
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  deleteComment(comment.id);
                }}
              >
                Delete
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

function Comments({ postId }) {
  const { currentUser } = useAuthentication();
  // TODO: Handle loading and trying to post case
  const { comments, addComment, deleteComment, editComment } =
    usePostComments(postId);
  return (
    <>
      {currentUser && <NewComment addComment={addComment} />}
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          comment={comment}
          editComment={editComment}
          deleteComment={deleteComment}
          currentUser={currentUser}
        />
      ))}
    </>
  );
}

function NewComment({ addComment }) {
  const textAreaRef = useRef();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent browser form submission.
        addComment(textAreaRef.current.value).then(() => {
          textAreaRef.current.value = "";
        });
      }}
    >
      <textarea ref={textAreaRef} placeholder="Add comment ..."></textarea>
      <button>Add comment</button>
    </form>
  );
}

const maxCommentPages = 100; // Avoid hammering server too much
function usePostComments(postId) {
  const { authenticationToken } = useAuthentication();
  const [comments, setComments] = useState([]);

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

    const json = await fetchResult.json();
    setComments((previous) => [json.comment, ...previous]);
  }

  async function deleteComment(commentId) {
    const fetchResult = await fetch(`${restApiBaseUrl}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: authenticationToken },
    });
    if (!fetchResult.ok) {
      throw new Error(`Unexpected status. ${fetchResult.status}`);
    }

    setComments((previous) => previous.filter(({ id }) => id !== commentId));
  }

  async function editComment(commendId, commentText) {
    const fetchResult = await fetch(`${restApiBaseUrl}/comments/${commendId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authenticationToken,
      },
      body: JSON.stringify({
        comment: { content: commentText },
      }),
    });
    if (!fetchResult.ok) {
      throw new Error(`Unexpected status. ${fetchResult.status}`);
    }
    const json = await fetchResult.json();
    setComments((previous) =>
      previous.map((comment) =>
        comment.id === commendId ? json.comment : comment
      )
    );
  }

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      // For reduced scope, don't support paging. Load everything
      let hasMore = true;
      let comments = [];
      for (let page = 1; hasMore && page <= maxCommentPages; page++) {
        const fetchResult = await fetch(
          `${restApiBaseUrl}/posts/${postId}/comments?page=${page}`
        );
        const json = await fetchResult.json();
        if (isCancelled) {
          return;
        }

        if (!fetchResult.ok) {
          throw new Error(`Unexpected status. ${fetchResult.status}`);
        }

        const newPage = json.comments;
        comments = [...comments, ...newPage];

        hasMore = newPage.length;
      }

      comments.sort((a, b) => {
        if (a.created_at < b.created_at) {
          return 1;
        } else if (a.created_at > b.created_at) {
          return -1;
        } else {
          return 0;
        }
      });
      setComments(comments);
    })();

    return () => {
      isCancelled = true;
    };
  }, [postId]);

  return { comments, addComment, deleteComment, editComment };
}
