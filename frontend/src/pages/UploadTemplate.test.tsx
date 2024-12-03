import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UploadTemplate } from "./UploadTemplate";
import { Wrapper } from "../utils/tests";

describe("UploadTemplate component", () => {
  it("matches the snapshot", () => {
    const { asFragment } = render(<UploadTemplate />, { wrapper: Wrapper });
    expect(asFragment()).toMatchSnapshot();
  });
});
