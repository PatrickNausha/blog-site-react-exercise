import { Link } from "react-router-dom";

export function SignIn() {
  return (
    <div>
      <h2>Sign In</h2>
      <form>
        <div>
          <input type="email" />
        </div>
        <div>
          <input type="password" />
        </div>
        <button>Sign in</button>
        <p>
          Don't have an account? <Link to={"/register"}>Create one</Link>.
        </p>
      </form>
    </div>
  );
}
