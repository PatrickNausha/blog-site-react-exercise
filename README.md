# React Blog Site

This project was created as a coding exercise.

## Overview

### Features

The site supports the following operations

- Create an Account and authenticate against protected API endpoints using JWT
- Create, edit and delete posts
- Comment on posts
- Browse and read blog posts and comments from other users

### Non-features

In order to reduce project scope and support deployment to GitHub pages, the following features are intentionally omitted.

- Full URL-based routing.
  - This project uses a hash-based routing system. This antiquated single-page application routing approach uses the URL fragment (e.g. `/blog-site-react-exercise/#/posts/create` instead of just `/blog-site-react-exercise/posts/create`)
- Persistent authentication
  - This application does not use cookie authentication.
  - In a commercial context, this application would likely use a reverse proxy that transforms the JWT Authorization header into a cookie.
  - An HTTP-only cookie instead of a JWT Authorization header would also reduce the risk that the JWT was stolen by a bad actor.
- Sever Side Rendering
  - This is a client side rendered, single-page application.
  - Rationale: Using only static files and no server code allows the site to be deployed to GitHub pages.
- Error feedback
  - Error feedback is extremely limited.
  - If the user provides bad input, e.g. invalid password, either a generic error message or no error message will be shown.
  - Operations that fail due to server errors may silently fail or crash the page.

## Developing

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
