import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "./authentication";

export function SignIn() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signIn } = useAuthentication();
  const navigate = useNavigate();

  // TODO: Make error messages more helpful and prettier.
  const [error, setError] = useState(null);

  return (
    <div>
      <h2>Sign In</h2>
      <form>
        <div>
          <label>
            Email
            <input type="email" ref={emailRef} />
          </label>
        </div>
        <div>
          <label>
            Password
            <input type="password" ref={passwordRef} />
          </label>
        </div>
        <button
          onClick={() => {
            signIn({
              email: emailRef.current.value,
              password: passwordRef.current.value,
            })
              .then(() => {
                navigate("/");
              })
              .catch(() => {
                // TODO: Assert 2xx
                setError("An error occurred. Try Again.");
              });
          }}
        >
          Sign in
        </button>
        {error && <p>{error}</p>}
        <p>
          Don't have an account? <Link to={"/register"}>Create one</Link>.
        </p>
      </form>
    </div>
  );
}
