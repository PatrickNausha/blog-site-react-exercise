import { Link } from "react-router-dom";

export function Register() {
  return (
    <div>
      <h2>Create an Account</h2>
      <form>
        <div>
          <input type="email" />
        </div>
        <div>
          <input type="password" />
        </div>
        <button>Create</button>
        <p>
          Already have an account? <Link to={"/sign-in"}>Sign in</Link>.
        </p>
      </form>
    </div>
  );
}
