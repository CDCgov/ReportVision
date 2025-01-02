import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ErrorProvider, useError } from "./ErrorContext";

function TestComponent() {
  const { error, setError, resetError } = useError();

  return (
    <div>
      <p data-testid="errorMessage">
        {error ? error.message : "No error"}
      </p>
      <button
        data-testid="triggerError"
        onClick={() => setError(new Error("Test error"))}
      >
        Trigger Error
      </button>
      <button data-testid="resetError" onClick={resetError}>
        Reset Error
      </button>
    </div>
  );
}

describe("ErrorContext", () => {
  it("should default to null error", () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    const messageEl = screen.getByTestId("errorMessage");
    expect(messageEl).toHaveTextContent("No error");
  });

  it("should set and display the error message", () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    const triggerButton = screen.getByTestId("triggerError");
    fireEvent.click(triggerButton);

    const messageEl = screen.getByTestId("errorMessage");
    expect(messageEl).toHaveTextContent("Test error");
  });

  it("should reset the error message", () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    // Trigger the error first
    const triggerButton = screen.getByTestId("triggerError");
    fireEvent.click(triggerButton);

    // Reset the error
    const resetButton = screen.getByTestId("resetError");
    fireEvent.click(resetButton);

    const messageEl = screen.getByTestId("errorMessage");
    expect(messageEl).toHaveTextContent("No error");
  });
});
