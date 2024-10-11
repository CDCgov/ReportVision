// NotFound.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers
import NotFound from './404Page';

describe('NotFound Component', () => {
  it('should render the 404 image', () => {
    render(<NotFound />);
    const image = screen.getByTestId('404-image');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('404.svg'));
    expect(image).toHaveAttribute('alt', '404');
  });

  it('should have correct styling classes', () => {
    render(<NotFound />);
    const container = screen.getByTestId('404-image').parentElement;

    expect(container).toHaveClass('width-full');
    expect(container).toHaveClass('height-full');
    expect(container).toHaveClass('display-flex');
    expect(container).toHaveClass('flex-justify-center');
  });
});
