import React from 'react';
import './VerticalStepper.scss';

interface Step {
    label: string;
    link?: string;
}

interface VerticalStepperProps {
    steps: Step[];
    currentStep?: number;
}

const VerticalStepper: React.FC<VerticalStepperProps> = ({ steps, currentStep = 0 }) => {
    return (
        <div className="stepper">
            <p className='vertical-stepper-copy'>On this page</p>
            {steps.map((step, index) => (
                <div key={index} className={`step ${index + 1 === currentStep ? 'active' : ''}`}>
                    {index === currentStep && <div className="highlight-bar"></div>}
                    <div className={`step-content ${currentStep === index ? 'current-step' : ''}`}>
                        {step.link ? (
                            <a href={step.link} className="step-link">{step.label}</a>
                        ) : (
                            <span>{step.label}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VerticalStepper;
