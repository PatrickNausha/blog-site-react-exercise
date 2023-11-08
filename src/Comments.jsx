import { useEffect, useRef, useState } from "react";
import { restApiBaseUrl } from "./config";
import { useAuthentication } from "./authentication";

export function Comments({ postId, currentUser }) {
  const { comments, isLoading, addComment, deleteComment, editComment } =
    usePostComments(postId);
  return (
    <>
      {!isLoading && currentUser && <NewComment addComment={addComment} />}
      {!isLoading && comments.length === 0 ? (
        <span className="text-muted fst-italic mb-2">No comments yet.</span>
      ) : (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            editComment={editComment}
            deleteComment={deleteComment}
            currentUser={currentUser}
          />
        ))
      )}
    </>
  );
}

function Comment({ comment, currentUser, deleteComment, editComment }) {
  const isMyComment = comment.user.id === currentUser?.id;
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef();
  return (
    <article className="my-4">
      <span className="fw-bold">{comment.user.display_name}</span>
      {isEditing ? (
        <>
          <div>
            <textarea ref={editorRef} defaultValue={comment.content}></textarea>
          </div>
          <button
            className="btn btn-primary"
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
          <p className="my-0">{comment.content}</p>
          {isMyComment && (
            <>
              <button
                className="btn btn-link p-0"
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                Edit
              </button>
              &nbsp;&bull;&nbsp;
              <button
                className="btn btn-link p-0"
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
    </article>
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
      <div>
        <textarea ref={textAreaRef} placeholder="Add comment ..."></textarea>
      </div>
      <button className="btn btn-primary">Add comment</button>
    </form>
  );
}

const maxCommentPages = 100; // Avoid hammering server too much
function usePostComments(postId) {
  const { authenticationToken } = useAuthentication();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    (async () => {
      let hasMore = true;
      let comments = [];
      setIsLoading(true);

      // For reduced scope, don't support paging. Load everything
      for (let page = 1; hasMore && page <= maxCommentPages; page++) {
        const fetchResult = await fetch(
          `${restApiBaseUrl}/posts/${postId}/comments?page=${page}`
        );
        const json = await fetchResult.json();

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
      setIsLoading(false);
    })();
  }, [postId]);

  return { comments, isLoading, addComment, deleteComment, editComment };
}
