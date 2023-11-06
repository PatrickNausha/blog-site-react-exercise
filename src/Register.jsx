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
    <div className="container">
      <h2>Create an Account</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent browser form submission
          register({
            email: emailRef.current.value,
            password: passwordRef.current.value,
            displayName: displayNameRef.current.value,
          })
            .then(() => {
              navigate("/");
            })
            .catch((e) => {
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
        <div className="pb-3">
          <label>
            <div>Display Name</div>
            <input type="text" ref={displayNameRef} />
          </label>
        </div>
        <button className="btn btn-primary mb-3">Create</button>
        {error && <p>{error}</p>}
        <p>
          Already have an account? <Link to={"/sign-in"}>Sign in</Link>.
        </p>
      </form>
    </div>
  );
}
