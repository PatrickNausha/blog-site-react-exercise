import { Outlet } from "react-router-dom";
import { useAuthentication } from "./authentication";

export function Root() {
  const { currentUser } = useAuthentication();
  return (
    <div>
      <h1>The Best Blog Site Ever</h1>
      {
        // TODO: hide on sign-in page
        !currentUser && <a href="/sign-in">Sign in</a>
      }
      <Outlet />
    </div>
  );
}
