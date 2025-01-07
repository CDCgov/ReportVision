# Frontend React App


Welcome to the **Frontend React App** for the ReportVision project. This guide provides instructions to help you get started with the application and run tests + linting.



## Table of Contents
1. [Introduction](#introduction)
2. [Setup and Installation](#setup-and-installation)
3. [Development Workflow](#development-workflow)
4. [Testing and E2E Commands](#testing-and-e2e-commands)
5. [Frontend Architecture](#project-architecture)
8. [Troubleshooting](#troubleshooting)



## Introduction

This frontend application is built using **React**, **TypeScript**, and **Vite**. It includes configurations for ESLint and end-to-end (E2E) testing using Playwright.

---

## Setup and Installation

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation and Run Steps
1. Clone the repository:
   ```shell
   git clone https://github.com/CDCgov/ReportVision.git
   cd ReportVision/frontend

2. Install Dependencies: 

```shell
npm install 
```

3. Start the app in dev mode: 

```shell
npm run dev
```

4. Run tests to verify installation

```shell
npm run tests
```

### Testing and E2E Commands 


Runs the end-to-end tests.

```shell
npx playwright test
```

Starts the interactive UI mode.

```shell
npx playwright test --ui
```

Runs the tests only on Desktop Chrome.

```shell
npx playwright test --project=chromium
```

Runs the tests in a specific file.

```shell
npx playwright test example
```

Runs the tests in debug mode.

```shell
  npx playwright test --debug
```

Auto generate tests with Codegen.

```shell
npx playwright codegen
```

#### Fast Refresh

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# Troubleshooting

### Common Issues
1. Installation Errors: Ensure all prerequisites are installed.
2. Development Server Not Starting: Check for port conflicts or missing dependencies. 
3. Tests Failing: Verify Playwright setup and ensure browsers are installed:

# Project Architecture

### Description of Key Directories and Files in the frontend:
- **`public/`**: Holds public static files like images, logos, and `index.html`. These files are directly served by the development and production servers.
- **`src/`**: Contains the core application code, including React components, pages, styles, and utilities.
  - **`components/`**: Houses UI components.
  - **`pages/`**: Organizes page-level components corresponding to application routes.
  - **`styles/`**: Includes global and component-specific styles.
  - **`utils/`**: Contains helper functions used across the application.
  - **`App.tsx`**: The main application component where routes and global providers are defined.
  - **`main.tsx`**: The entry point that initializes the React app and mounts it to the DOM.
- **`tests/`**: Includes test files for unit testing and end-to-end testing.
- **`package.json`**: Lists project dependencies and npm scripts for building, running, and testing the application.
- **`vite.config.ts`**: Configuration file for Vite, the build tool used for development and production builds.
- **`tsconfig.json`**: TypeScript configuration, defining compiler options and project structure.



## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```
