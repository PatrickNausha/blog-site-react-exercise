import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";
import { Root } from "./Root";
import { Homepage } from "./Homepage";
import { Post } from "./Post";
import { SignIn } from "./SignIn";
import { Register } from "./Register";
import { CreatePost } from "./CreatePost";
import { AuthenticationScope } from "./authentication";
import reportWebVitals from "./reportWebVitals";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Homepage />} />
      <Route path="posts/:postId" element={<Post />} />
      <Route path="posts/:postId/edit" element={<CreatePost />} />
      <Route path="posts/create" element={<CreatePost />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="register" element={<Register />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthenticationScope>
      <RouterProvider router={router} />
    </AuthenticationScope>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
