import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import Toolbar from '../Toolbar';

describe('Toolbar component', () => {
  const renderComponent = (initialPage: number, totalPages: number) => {
    render(
      <Toolbar
        initialPage={initialPage}
        totalPages={totalPages}
      />
    );
  };

  it('renders the component with initial props', () => {
    renderComponent(1, 5);

    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('page-number')).toBeInTheDocument();
    expect(screen.getByTestId('page-number-input')).toHaveValue('1');
    expect(screen.getByTestId('page-number-total')).toHaveTextContent('of 5');
  });

  it('calls handlePrevious when the previous button is clicked', () => {
    renderComponent(2, 5);

    const previousButton = screen.getByTestId('page-number-previous');
    fireEvent.click(previousButton);

    expect(screen.getByTestId('page-number-input')).toHaveValue('1');
  });

  it('calls handleNext when the next button is clicked', () => {
    renderComponent(1, 5);

    const nextButton = screen.getByTestId('page-number-next');
    fireEvent.click(nextButton);

    expect(screen.getByTestId('page-number-input')).toHaveValue('2');
  });

  it('disables the previous button on the first page', () => {
    renderComponent(1, 5);

    const previousButton = screen.getByTestId('page-number-previous');
    expect(previousButton).toBeDisabled();
  });

  it('disables the next button on the last page', () => {
    renderComponent(5, 5);

    const nextButton = screen.getByTestId('page-number-next');
    expect(nextButton).toBeDisabled();
  });
});