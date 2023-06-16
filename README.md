# Hiver React app boilerplate

## Overview

This repository contains a React based boilerplate that can be used to quickly bootstrap new applications.

## Technical stack

[TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html), [React](https://reactjs.org/docs/getting-started.html), [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started), [Styled Components](https://styled-components.com/docs/basics#getting-started), [Vitest](https://vitest.dev/guide/) (uses chai, jsdom and jest compatible API) for tests and [Vite](https://vitejs.dev/guide/) (uses esbuild, rollup) for building.

## Code structure

-   src
    -   assets - images and other static files.
    -   components - reusable blocks of code, that can be used on several pages. Components can be located in sub-directories if needed.
    -   hooks - reusable hooks
    -   pages - pages, associates with routes. Pages consist of components.
    -   service - low-level network functionality. One should rarely need to change anything there.
    -   store - redux-toolkit slices/api.
    -   types - TypeScript types for e.g. libraries w/o typings or assets.

## IDE integration

### VS Code

Install eslint and prettier plugins from the marketplace to enable code formatting on-the-fly.

## Available commands

-   serve - launch dev server
-   build - build the project in production mode
-   test - run unit tests
-   lint - run linter & prettier
-   lint:fix - fix linter & prettier issues in the code-base

## How to use it

Clone the boilerplate, e.g. by using degit:

```
npx degit --mode=git git@github.com:GrexIt/react-frontend-boilerplate your-project-name
```

Init git repository

```
cd your-project-name && git init && git add . && git commit -m 'Init repo'
```

Edit the package.json, index.html and src/App.tsx as you see fit. Provide your project's sentry dsn to Sentry.init method (You may have to create a Sentry project first [link](https://sentry.io/organizations/hiver/projects/)).
You can freely remove the testing store from the src/store directory. Also you can remove the store completely if you're writing e.g. a library of components, for that remove the whole store directory and remove all mentions of it from main.tsx
# finance-ui
