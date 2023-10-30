import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Root, Index } from "./App";
import { Post } from "./Post";
import { SignIn } from "./SignIn";
import { Register } from "./Register";
import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<Index />} />
      <Route path="posts/:postId" element={<Post />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="register" element={<Register />} />
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
