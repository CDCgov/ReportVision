import React from "react";
import { render, screen } from "@testing-library/react";
import { ExtractStepper } from "../ExtractStepper";
import { ExtractStep } from "../../utils/constants";

describe("ExtractStepper component", () => {
  it("renders the StepIndicator component", () => {
    render(<ExtractStepper currentStep={ExtractStep.Upload} />);

    const stepIndicator = screen.getByTestId("step-indicator");
    expect(stepIndicator).toBeInTheDocument();
  });
});
