import { useState, useContext, createContext } from "react";
import { restApiBaseUrl } from "./config";

const AuthenticationContext = createContext(null);

export function AuthenticationScope({ children }) {
  const [authenticationToken, setAuthenticationToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  async function signIn({ email, password }) {
    const fetchResult = await fetch(`${restApiBaseUrl}/users/sign_in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          email,
          password,
        },
      }),
    });
    const json = await fetchResult.json();
    setCurrentUser(json);
  }
  async function register({ email, password, displayName }) {
    const fetchResult = await fetch(`${restApiBaseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          email,
          password,
          display_name: displayName,
        },
      }),
    });
    const json = await fetchResult.json();
    setCurrentUser(json);

    // TODO: Set auth token
  }

  return (
    <AuthenticationContext.Provider
      value={{ authenticationToken, currentUser, signIn, register }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "Could not find AuthenticationContext. Are you missing an AuthenticationScope element?"
    );
  }

  const { authenticationToken, signIn, register } = context;

  return {
    authenticationToken,
    signIn,
    register,
  };
}
