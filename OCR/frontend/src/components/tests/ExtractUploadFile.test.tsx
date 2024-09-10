import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { ExtractUploadFile } from "../ExtractUploadFile";
import { Wrapper } from "../../utils/tests";

describe("ExtractUploadFile component", () => {
  it("renders the header with correct text", () => {
    render(<ExtractUploadFile onUploadComplete={vi.fn()} />, {
      wrapper: Wrapper,
    });

    const mainHeading = screen.getByRole("heading", {
      name: /choose template and upload new form/i,
    });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveStyle({ margin: "0" });

    const subHeading = screen.getByRole("heading", {
      name: /upload new image or pdf to extract data from/i,
    });
    expect(subHeading).toBeInTheDocument();
    expect(subHeading).toHaveStyle({ margin: "10px" });
  });

  it("renders the upload area with correct structure", () => {
    render(<ExtractUploadFile onUploadComplete={vi.fn()} />, {
      wrapper: Wrapper,
    });

    const dashedContainer = screen.getByTestId("dashed-container");
    expect(dashedContainer).toBeInTheDocument();
    expect(dashedContainer).toHaveStyle({
      width: "70%",
      height: "50%",
      border: "1px dashed #005ea2",
    });

    const uploadIcon = screen.getByTestId("upload-icon");
    expect(uploadIcon).toBeInTheDocument();

    const dragDropText = screen.getByRole("heading", {
      name: /drag and drop file here/i,
    });
    expect(dragDropText).toBeInTheDocument();
    expect(dragDropText).toHaveStyle({ fontWeight: "bold" });

    const fileInput = screen.getByTestId("file-input-input");
    expect(fileInput).toBeInTheDocument();
  });
});
