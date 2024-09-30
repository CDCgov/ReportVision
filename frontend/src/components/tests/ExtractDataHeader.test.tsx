import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ExtractDataHeader from "../ExtractDataHeader";

describe("ExtractDataHeader component", () => {
  it("renders the header with correct structure", () => {
    render(
      <ExtractDataHeader
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isUploadComplete={false}
      />,
      { wrapper: BrowserRouter }
    );

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    const closeButton = screen.getByTestId("close-button");
    expect(closeButton).toBeInTheDocument();

    const heading = screen.getByRole("heading", { name: /extract data/i });
    expect(heading).toBeInTheDocument();

    const backButton = screen.getByRole("button", { name: /back/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveStyle({
      height: "40px",
      color: "#adadad",
    });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("renders all buttons with correct text", () => {
    render(
      <ExtractDataHeader
        onBack={vi.fn()}
        onSubmit={vi.fn()}
        isUploadComplete={false}
      />,
      { wrapper: BrowserRouter }
    );

    const backButton = screen.getByRole("button", { name: /back/i });
    const submitButton = screen.getByRole("button", { name: /submit/i });

    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveTextContent("Back");

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("Submit");
  });
});
