import { Link } from "react-router-dom";
const dateFormat = new Intl.DateTimeFormat("en-US");

export function PostPreview({ post }) {
  return (
    <div>
      <h2>
        <Link to={`/posts/${post.id}`}>{post.title}</Link> (
        {dateFormat.format(new Date(post.created_at))})
      </h2>
      <h3>by {post.user.display_name}</h3>
    </div>
  );
}
