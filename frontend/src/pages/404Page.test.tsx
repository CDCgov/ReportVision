// NotFound.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import NotFound from './404Page';

const mockNavigate = vi.fn(); // Create a mock function for navigation  
// Mock the useNavigate hook from react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
  };
});
describe('NotFound Component', () => {
  it('should render the NotFound component', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    // Check if the 404 image is rendered
    expect(screen.getByTestId('404-image')).toBeInTheDocument();

    // Check if the title and description are rendered
    expect(screen.getByText("Sorry, this page can’t be found")).toBeInTheDocument();
    expect(screen.getByText("The page you are looking for doesn’t exist or has been moved.")).toBeInTheDocument();

    // Check if the button is rendered
    expect(screen.getByRole('button', { name: /Back to Previous Page/i })).toBeInTheDocument();
  });


  it('should navigate back when the back button is clicked', () => {
    render(
        <BrowserRouter>
          <NotFound />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/back/i));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
