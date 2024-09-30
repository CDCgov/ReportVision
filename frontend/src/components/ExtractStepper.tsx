import { StepIndicator, StepIndicatorStep } from "@trussworks/react-uswds";
import { ExtractStep } from "../utils/constants.ts";

export const ExtractStepper = ({
  currentStep,
}: {
  currentStep: ExtractStep;
}) => {
  const stepOrder: ExtractStep[] = [
    ExtractStep.Upload,
    ExtractStep.Extract,
    ExtractStep.Review,
    ExtractStep.Submit,
  ];

  const determineStatus = (step: ExtractStep, currentStep: ExtractStep) => {
    const currentStepIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    if (currentStepIndex > stepIndex) return "complete";
    else if (currentStepIndex === stepIndex) return "current";
    else return "incomplete";
  };

  return (
    <StepIndicator
      data-testid="step-indicator"
      headingLevel="h5"
      headingProps={{ style: { display: "none" } }}
    >
      {stepOrder.map((step: ExtractStep) => (
        <StepIndicatorStep
          key={step}
          label={step}
          status={determineStatus(step, currentStep)}
        />
      ))}
    </StepIndicator>
  );
};
