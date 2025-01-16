# Frontend React App


Welcome to the **Frontend React App** for the ReportVision project. This guide provides instructions to help you get started with the application and run tests + linting.



## Table of Contents
1. [Introduction](#introduction)
2. [Setup and Installation](#setup-and-installation)
3. [Testing](#testing)
4. [Frontend Architecture](#project-architecture)
5. [Troubleshooting](#troubleshooting)



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

### Testing


Runs the end-to-end tests.

```shell
npx playwright test
```

Starts the interactive UI mode.

```shell
npx playwright test --ui
```

Runs the tests only on Chrome.

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

Currently, two plugins are available:

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
- **`src/`**: Contains the application code, including React components, pages, styles, and utilities.
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

## Mock Error Handling Framework

To facilitate testing and simulate error scenarios in your application, you can use a mock error handling framework. This framework allows you to mock different types of errors and their corresponding behaviors, enabling you to thoroughly test your error handling logic.

Here's an example of how you can set up a mock error handling framework using Jest:

1. Install the necessary dependencies:

```shell
npm install jest @types/jest --save-dev
```

2. Create a `mockError.ts` file in your test directory:

```typescript
export class MockError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'MockError';
  }
}

export const mockError = (message?: string): void => {
  throw new MockError(message);
};
```

3. Write a test case that simulates an error scenario:

```typescript
import { mockError } from './mockError';

describe('Error Handling', () => {
  it('should handle a mock error', () => {
    expect(() => {
      // Simulate an error by calling the mockError function
      mockError('Something went wrong');
    }).toThrow('MockError: Something went wrong');
  });
});
```

By using this mock error handling framework, you can easily simulate different error scenarios and ensure that your application handles them correctly.

Remember to customize the `MockError` class and the `mockError` function according to your specific error handling needs.

4. Implement an Error Provider and Context:

```typescript
import React, { createContext, useState } from 'react';

interface ErrorContextProps {
  error: Error | null;
  setError: (error: Error | null) => void;
}

export const ErrorContext = createContext<ErrorContextProps>({
  error: null,
  setError: () => {},
});

export const ErrorProvider: React.FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};
```

5. Implement an Error Boundary component:

```typescript
import React, { Component, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

With the Error Provider and Context, you can manage and propagate errors throughout your application. The Error Boundary component helps catch and handle errors in your components, providing a fallback UI when an error occurs.

Remember to customize the Error Provider, Context, and Error Boundary according to your specific error handling needs.

## Mock API and Transition to Real API

In this project, we have implemented a mock API that allows you to simulate API responses during development and testing. This is particularly useful when you are working on frontend features that depend on backend APIs that may not be fully implemented or available yet.

To use the mock API, you can follow these steps:

1. Open the `AuthContext.tsx` file.

2. Inside the `AuthContext.tsx` file, you will find a mocked api login that checks for a sample password and usename. You can replace this with an actual implementation for a real API.

  ```typescript
  export const mockLogin = async (username: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock authentication logic
    if (username === 'test@cdc.gov' && password === 'Password1') {
      return {
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(7)
      };
    } else {
      return { token: 'error' }
    }
  };
  ```

3. During development and testing, your frontend application will now display the login page and can test the UX flow for logging in.

Once the real API becomes available or you are ready to transition from the mock API to the real API, you can follow these steps:

4. Update the API endpoints in your code to use the real API instead of the mock API. For example:

  ```javascript
  import { api } from './api';

  // Use the real API instead of the mock API
  api.get('/users').then((response) => {
    // Handle the real API response
  });
  ```

5. Make sure to update any data structures or logic that depend on the mock responses to work with the real API responses.

By following these steps, you can easily transition from using the mock API to the real API in your application. This allows you to develop and test your frontend features with confidence, knowing that they will seamlessly integrate with the real API when it becomes available.


```
