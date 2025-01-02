// GlobalErrorBoundary.tsx
import React from "react";
import { useError } from "../contexts/ErrorContext";

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

interface GlobalErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryWrapper extends React.Component<
  GlobalErrorBoundaryProps & { onError: (error: Error) => void },
  GlobalErrorBoundaryState
> {
  constructor(props: GlobalErrorBoundaryProps & { onError: (error: Error) => void }) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  /**
   * getDerivedStateFromError is called during the render phase if
   * a child component throws an error. This sets hasError to true
   * so we don't re-render the same child that threw.
   */
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  /**
   * componentDidCatch is called after the commit phase when
   * there's an error. We log or handle the error (e.g., send to Sentry),
   * and call the onError callback to update our global context.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError(error);
    console.error("GlobalErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI or nothing at all
      return null;
    }

    // If no error, just render children
    return this.props.children;
  }
}

/**
 * Functional wrapper that can use the `useError` hook and pass it down
 * to the class-based boundary
 */
const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({ children }) => {
  const { setError } = useError();

  return (
    <ErrorBoundaryWrapper onError={setError}>
      {children}
    </ErrorBoundaryWrapper>
  );
};

export default GlobalErrorBoundary;
