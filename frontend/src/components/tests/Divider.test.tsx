import { render } from "@testing-library/react";
import "@testing-library/jest-dom"; // for the `toHaveStyle` matcher
import { describe, it, expect } from "vitest";
import { Divider } from "../Divider";

describe("Divider component", () => {
  it("renders with default props", () => {
    const { container } = render(<Divider />);

    const divider = container.firstChild;

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveStyle({
      borderBottom: "1px solid #ccc",
      margin: "16px 0",
    });
  });

  it("renders with custom color and thickness", () => {
    const { container } = render(<Divider color="red" thickness="2px" />);

    const divider = container.firstChild;

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveStyle({
      borderBottom: "2px solid red",
    });
  });

  it("renders with custom margin", () => {
    const { container } = render(<Divider margin="24px 8px" />);

    const divider = container.firstChild;

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveStyle({
      margin: "24px 8px",
    });
  });

  it("renders with additional custom styles", () => {
    const customStyle = {
      width: "50%",
      borderRadius: "4px",
    };

    const { container } = render(<Divider style={customStyle} />);

    const divider = container.firstChild;

    expect(divider).toBeInTheDocument();
    expect(divider).toHaveStyle(customStyle);
  });
});
