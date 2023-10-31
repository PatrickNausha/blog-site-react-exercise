import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "./authentication";

export function Register() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const displayNameRef = useRef();
  const { register } = useAuthentication();
  const navigate = useNavigate();

  // TODO: Make error messages more helpful and prettier.
  const [error, setError] = useState(null);

  return (
    <div>
      <h2>Create an Account</h2>
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
        <div>
          <label>
            Display Name
            <input type="text" ref={displayNameRef} />
          </label>
        </div>
        <button
          onClick={() => {
            register({
              email: emailRef.current.value,
              password: passwordRef.current.value,
              displayName: displayNameRef.current.value,
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
          Create
        </button>
        {error && <p>{error}</p>}
        <p>
          Already have an account? <Link to={"/sign-in"}>Sign in</Link>.
        </p>
      </form>
    </div>
  );
}
