import { Outlet } from "react-router-dom";
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
      {
        // TODO: hide on sign-in page
        !currentUser && <a href="/sign-in">Sign in</a>
      }
      <Outlet />
    </div>
  );
}
