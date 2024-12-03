import { StepIndicator, StepIndicatorStep } from "@trussworks/react-uswds";
import { AnnotateStep } from "../utils/constants.ts";

export const Stepper = ({ currentStep }: { currentStep: AnnotateStep }) => {
  const stepOrder: AnnotateStep[] = [
    AnnotateStep.Upload,
    AnnotateStep.Annotate,
    AnnotateStep.Save,
  ];

  const determineStatus = (step: AnnotateStep, currentStep: AnnotateStep) => {
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
      {stepOrder.map((step: AnnotateStep) => (
        <StepIndicatorStep
          key={step}
          label={step}
          status={determineStatus(step, currentStep)}
        />
      ))}
    </StepIndicator>
  );
};
