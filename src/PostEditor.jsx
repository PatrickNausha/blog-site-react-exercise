import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useAuthentication } from "./authentication";
import { restApiBaseUrl } from "./config";

export function PostEditor() {
  const { postId } = useParams();
  const textEditorRef = useRef();
  const titleInputRef = useRef();
  const { currentUser, authenticationToken } = useAuthentication();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  useEffect(() => {
    if (postId == null) {
      return;
    }

    (async () => {
      const fetchResult = await fetch(`${restApiBaseUrl}/posts/${postId}`);
      const json = await fetchResult.json();
      setPost(json.post);
    })();
  }, [postId]);

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

  async function updatePost() {
    const fetchResult = await fetch(`${restApiBaseUrl}/posts/${postId}`, {
      method: "PATCH",
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
      <div className="container">
        <Link to="/sign-in">Sign in</Link> to create a post.
      </div>
    );
  }

  const isEditing = postId != null;
  const save = isEditing ? updatePost : createPost;
  if (isEditing && !post) {
    return <div className="container">Loading ...</div>;
  }

  return (
    <form
      className="container"
      onSubmit={(e) => {
        e.preventDefault(); // Prevent browser form submission
        save().then(({ id }) => {
          navigate(`/posts/${id}`);
        });
      }}
    >
      <h2>{isEditing ? "Edit Post" : "Create Post"}</h2>
      <label>
        Title{" "}
        <input
          placeholder="Post title"
          defaultValue={post?.title}
          type="text"
          ref={titleInputRef}
        />
      </label>
      <div className="my-2">
        <textarea
          defaultValue={post?.body}
          ref={textEditorRef}
          placeholder="Post content"
        ></textarea>
      </div>
      <button className="btn btn-primary">
        {isEditing ? "Save" : "Create"}
      </button>
    </form>
  );
}
