import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import PageNumber from "../PageNumber";

describe("PageNumber component", () => {
  const onPrevious = vi.fn();
  const onNext = vi.fn();

  const renderComponent = (currentPage: number, totalPages: number) => {
    render(
      <PageNumber
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );
  };

  it("renders the component with initial props", () => {
    renderComponent(1, 5);

    expect(screen.getByTestId("page-number")).toBeInTheDocument();
    expect(screen.getByTestId("page-number-text")).toHaveTextContent("Page");
    expect(screen.getByTestId("page-number-input")).toHaveValue("1");
    expect(screen.getByTestId("page-number-total")).toHaveTextContent("of 5");
  });

  it("calls onPrevious when the previous button is clicked", () => {
    renderComponent(2, 5);

    const previousButton = screen.getByTestId("page-number-previous");
    fireEvent.click(previousButton);

    expect(onPrevious).toHaveBeenCalled();
  });

  it("calls onNext when the next button is clicked", () => {
    renderComponent(1, 5);

    const nextButton = screen.getByTestId("page-number-next");
    fireEvent.click(nextButton);

    expect(onNext).toHaveBeenCalled();
  });

  it("disables the previous button on the first page", () => {
    renderComponent(1, 5);

    const previousButton = screen.getByTestId("page-number-previous");
    expect(previousButton).toBeDisabled();
  });

  it("disables the next button on the last page", () => {
    renderComponent(5, 5);

    const nextButton = screen.getByTestId("page-number-next");
    expect(nextButton).toBeDisabled();
  });
});
