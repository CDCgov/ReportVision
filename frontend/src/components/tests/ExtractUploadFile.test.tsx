import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { ExtractUploadFile } from "../ExtractUploadFile";
import { Wrapper } from "../../utils/tests";
import React from "react";

vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: {
    workerSrc: `//unpkg.com/pdfjs-dist@2.0.0/build/pdf.worker.min.mjs`,
  },
  version: '2.0.0',
  getDocument: vi.fn().mockReturnValue({
    promise: Promise.resolve({
      numPages: 1,
      getPage: vi.fn().mockReturnValue(Promise.resolve({
        getTextContent: vi.fn().mockReturnValue(Promise.resolve({
          items: [{ str: "Mocked text content" }]
        }))
      }))
    })
  })
}));

describe("ExtractUploadFile component", () => {
  it("renders the header with correct text", () => {
    render(<ExtractUploadFile onUploadComplete={vi.fn()} />, {
      wrapper: Wrapper,
    });

    const mainHeading = screen.getByRole("heading", {
      name: /Upload new image or PDF to extract data from/i,
    });
    expect(mainHeading).toBeInTheDocument();

    const subHeading = screen.getByRole("heading", {
      name: /upload new image or pdf to extract data from/i,
    });
    expect(subHeading).toBeInTheDocument();
  });

  it("renders the upload area with correct structure", () => {
    render(<ExtractUploadFile onUploadComplete={vi.fn()} />, {
      wrapper: Wrapper,
    });

    const dashedContainer = screen.getByTestId("dashed-container");
    expect(dashedContainer).toBeInTheDocument();

    const buttons = screen.queryAllByTestId("button");
    expect(buttons).toHaveLength(2);

    const dragDropText = screen.getByRole("heading", {
      name: /Upload new image or PDF to extract data from/i,
    });
    expect(dragDropText).toBeInTheDocument();
    expect(dragDropText).toHaveStyle({ fontWeight: "bold" });

    const fileInput = screen.getByTestId("file-input-input");
    expect(fileInput).toBeInTheDocument();
  });
});
