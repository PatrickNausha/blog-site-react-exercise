import { Outlet, Link } from "react-router-dom";
import { useAuthentication } from "./authentication";

export function Root() {
  const { currentUser } = useAuthentication();
  return (
    <>
      <div className="container py-5 my-4">
        <h1 className="text-center mb-4">
          <Link className="text-decoration-none" href="/">
            Ultimate Blog Site
          </Link>
        </h1>
        <p className="text-center mb-4">
          This is a coding exercise blog site. Do not take the content
          seriously.
        </p>
        <div className="d-flex">
          <span className="mx-auto">
            {!currentUser && (
              <>
                <Link to="/sign-in">Sign in</Link>&nbsp;&bull;&nbsp;
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
    </>
  );
}
