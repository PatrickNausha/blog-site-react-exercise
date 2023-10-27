import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// TODO: Factor to shared location.
const dateFormat = new Intl.DateTimeFormat("en-US");
const baseUrl = "https://brivity-react-exercise.herokuapp.com";

export function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    (async () => {
      const fetchResult = await fetch(`${baseUrl}/posts/${postId}`);
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
    </div>
  );
}
