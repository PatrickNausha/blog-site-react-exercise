import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuthentication } from "./authentication";
import { restApiBaseUrl } from "./config";

export function CreatePost() {
  const textEditorRef = useRef();
  const titleInputRef = useRef();
  const { currentUser, authenticationToken } = useAuthentication();
  const navigate = useNavigate();

  async function createPost() {
    const fetchResult = await fetch(`${restApiBaseUrl}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authenticationToken,
      },
      body: JSON.stringify({
        post: {
          title: titleInputRef.current.value,
          body: textEditorRef.current.value,
        },
      }),
    });
    if (!fetchResult.ok) {
      throw new Error(`Unexpected status. ${fetchResult.status}`);
    }

    const json = await fetchResult.json();
    return json.post;
  }

  if (!currentUser) {
    return (
      <div>
        <Link to="/sign-in">Sign in</Link> to create a post.
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent browser form submission
        createPost(textEditorRef.current.value).then(({ id }) => {
          navigate(`/posts/${id}`);
        });
      }}
    >
      <h2>Create Post</h2>
      <label>
        Title: <input type="text" ref={titleInputRef} />
      </label>
      <textarea ref={textEditorRef} placeholder="Create post"></textarea>
      <button>Create</button>
    </form>
  );
}
