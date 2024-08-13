import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { Stepper } from '../Stepper';

describe('Stepper component', () => {
  it('renders the StepIndicator component', () => {
    render(<Stepper />);
    
    // Check that the StepIndicator is rendered
    const stepIndicator = screen.getByTestId('step-indicator');
    expect(stepIndicator).toBeInTheDocument();
  });
});
