import { Outlet } from "react-router-dom";
import { useAuthentication } from "./authentication";

export function Root() {
  const { currentUser } = useAuthentication();
  return (
    <div>
      <div class="container py-5 my-4">
        <h1 class="text-center mb-4">Ultimate Blog Site</h1>
        <p class="text-center mb-4">
          This is a coding exercise blog site. Do not take the content
          seriously.
        </p>
        <div class="d-flex">
          <span class="mx-auto">
            <a
              href="https://github.com/patricknausha/threejs-demos"
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
