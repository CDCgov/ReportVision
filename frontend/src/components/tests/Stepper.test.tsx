import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { Stepper } from "../Stepper";
import { AnnotateStep } from "../../utils/constants.ts";

describe("Stepper component", () => {
  it("renders the StepIndicator component", () => {
    render(<Stepper currentStep={AnnotateStep.Upload} />);

    // Check that the StepIndicator is rendered
    const stepIndicator = screen.getByTestId("step-indicator");
    expect(stepIndicator).toBeInTheDocument();
  });
});
