import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorProvider, useError } from "../contexts/ErrorContext";
import GlobalErrorBoundary from "./ErrorBoundary";

/** 
 * A component that throws an error on mount to simulate a runtime error
 */
function ErrorThrowingComponent() {
  useEffect(() => {
    throw new Error("Component crashed!");
  }, []);
  return <div>Should never see this</div>;
}

function TestConsumer() {
  const { error } = useError();
  return (
    <div data-testid="error-context">
      {error ? error.message : "No error in context"}
    </div>
  );
}

describe("GlobalErrorBoundary", () => {
  it("should catch errors and set them in context", () => {
    render(
      <ErrorProvider>
        <GlobalErrorBoundary>
          <ErrorThrowingComponent />
        </GlobalErrorBoundary>
        <TestConsumer />
      </ErrorProvider>
    );

    // The boundary will catch the error thrown by ErrorThrowingComponent.
    // That means the child won't render, but the error should be stored in context.
    expect(screen.getByTestId("error-context")).toHaveTextContent(
      "Component crashed!"
    );
  });

  it("should not set an error in context if no error occurs", () => {
    render(
      <ErrorProvider>
        <GlobalErrorBoundary>
          <div data-testid="safe-child">Safe Child</div>
          <TestConsumer />
        </GlobalErrorBoundary>
      </ErrorProvider>
    );

    // Nothing was thrown, so we expect the context to have no error
    expect(screen.getByTestId("error-context")).toHaveTextContent(
      "No error in context"
    );
  });
});
