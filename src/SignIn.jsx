import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "./authentication";

export function SignIn() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signIn } = useAuthentication();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  return (
    <div className="container">
      <h2>Sign In</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent browser form submission
          signIn({
            email: emailRef.current.value,
            password: passwordRef.current.value,
          })
            .then(() => {
              navigate("/");
            })
            .catch(() => {
              setError("An error occurred. Try Again.");
              console.error(e);
            });
        }}
      >
        <div className="pb-3">
          <label>
            <div>Email</div>
            <input type="email" ref={emailRef} />
          </label>
        </div>
        <div className="pb-3">
          <label>
            <div>Password</div>
            <input type="password" ref={passwordRef} />
          </label>
        </div>
        <button className="btn btn-primary mb-3">Sign in</button>
        {error && <p>{error}</p>}
        <p>
          Don't have an account? <Link to={"/register"}>Create one</Link>.
        </p>
      </form>
    </div>
  );
}
