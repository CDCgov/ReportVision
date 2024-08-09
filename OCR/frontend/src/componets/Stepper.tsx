import { StepIndicator, StepIndicatorStep } from "@trussworks/react-uswds"

export const Stepper = () => {
    return (
        <StepIndicator  headingLevel="h5" headingProps={{  style: { display: 'none' }}}>
            <StepIndicatorStep
                label="Upload New Segment"
                status="current"
            />
            <StepIndicatorStep
                label="Annotate"
                status="incomplete"
            />
            <StepIndicatorStep
                label="Save Templete"
                status="incomplete"
            />
        </StepIndicator>
    )
}