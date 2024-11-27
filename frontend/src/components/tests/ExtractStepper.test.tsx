import React from "react";
import { render, screen } from "@testing-library/react";
import { ExtractStepper } from "../ExtractStepper";
import { ExtractStep } from "../../utils/constants";
import { Wrapper as wrapper } from "../../utils/tests";
describe("ExtractStepper component", () => {
  it("renders the StepIndicator component", () => {
    render(<ExtractStepper currentStep={ExtractStep.Upload} />, { wrapper });

    const stepIndicator = screen.getByTestId("step-indicator");
    expect(stepIndicator).toBeInTheDocument();
  });
});
