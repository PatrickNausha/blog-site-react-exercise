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
    <div className="container">
      <h2>{post.title}</h2>
      <h3>
        by {post.user.display_name} on{" "}
        {dateFormat.format(new Date(post.created_at))}
      </h3>
      {isMyPost && (
        <>
          <Link to={`/posts/${postId}/edit`}>Edit</Link>
          <button
            onClick={() => {
              deletePost().then(() => {
                navigate("/");
              });
            }}
          >
            Delete Post
          </button>
        </>
      )}
      <div class="border-bottom pb-4">{post.body}</div>
      <h3 class="my-4">Comments</h3>
      <Comments currentUser={currentUser} postId={post.id} />
    </div>
  );
}
