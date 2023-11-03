import { Outlet, Link } from "react-router-dom";
import { useAuthentication } from "./authentication";

export function Root() {
  const { currentUser } = useAuthentication();
  return (
    <div>
      <div className="container py-5 my-4">
        <h1 className="text-center mb-4">Ultimate Blog Site</h1>
        <p className="text-center mb-4">
          This is a coding exercise blog site. Do not take the content
          seriously.
        </p>
        <div className="d-flex">
          <span className="mx-auto">
            {
              // TODO: hide on sign-in page
              !currentUser && (
                <>
                  <Link to="/sign-in">Sign in</Link>&bull;
                </>
              )
            }
            {currentUser && (
              <>
                <Link to="/posts/create">Create post</Link>&bull;
              </>
            )}
            <a
              href="https://github.com/PatrickNausha/blog-site-react-exercise"
              target="_blank"
              rel="noreferrer"
            >
              View source
            </a>
          </span>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
