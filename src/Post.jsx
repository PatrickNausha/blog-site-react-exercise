import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { restApiBaseUrl, dateFormat } from "./config";
import { useAuthentication } from "./authentication";
import { Comments } from "./Comments";

export function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const { currentUser, authenticationToken } = useAuthentication();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const fetchResult = await fetch(`${restApiBaseUrl}/posts/${postId}`);
      const json = await fetchResult.json();
      setPost(json.post);
    })();
  }, [postId]);

  if (!post) {
    return <div className="container">Loading ...</div>;
  }

  async function deletePost() {
    const fetchResult = await fetch(`${restApiBaseUrl}/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: authenticationToken },
    });
    if (!fetchResult.ok) {
      throw new Error(`Unexpected status. ${fetchResult.status}`);
    }
  }

  const isMyPost = post.user.id === currentUser?.id;
  return (
    <>
      <article className="container">
        <h2>{post.title}</h2>
        <span className="fw-bold">
          by {post.user.display_name} on{" "}
          {dateFormat.format(new Date(post.created_at))}
        </span>
        {isMyPost && (
          <div className="mt-2">
            <Link
              className="btn btn-outline-primary btn-sm"
              to={`/posts/${postId}/edit`}
            >
              Edit
            </Link>{" "}
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                deletePost().then(() => {
                  navigate("/");
                });
              }}
            >
              Delete Post
            </button>
          </div>
        )}
        <div class="border-bottom py-4">{post.body}</div>
      </article>
      <div className="container">
        <h3 class="my-4">Comments</h3>
        <Comments currentUser={currentUser} postId={post.id} />
      </div>
    </>
  );
}
