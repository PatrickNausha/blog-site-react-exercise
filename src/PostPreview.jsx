import { Link } from "react-router-dom";
import { dateFormat } from "./config";

export function PostPreview({ post }) {
  return (
    <div className="py-3">
      <h2>
        <Link to={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <div>
        Posted on {dateFormat.format(new Date(post.created_at))} by{" "}
        {post.user.display_name}
      </div>
    </div>
  );
}
