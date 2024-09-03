import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SaveTemplate } from './SaveTemplate';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
  };
});

describe('SaveTemplate Component', () => {
  it('should render the SaveTemplate page with all elements', () => {
    render(
      <BrowserRouter>
        <SaveTemplate />
      </BrowserRouter>
    );

    expect(screen.getByTestId('save-template-title')).toBeInTheDocument();
    expect(screen.getByTestId('save-template-title')).toHaveTextContent('Save segmentation as a template');

    expect(screen.getByTestId('segmentation-template-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('segmentation-template-description-input')).toBeInTheDocument();
  });

  it('should navigate back when the back button is clicked', () => {
    render(
      <BrowserRouter>
        <SaveTemplate />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/back/i));

    expect(mockNavigate).toHaveBeenCalledWith('/new-template/annotate');
  });

  it('should navigate to the home page when the form is submitted', () => {
    render(
      <BrowserRouter>
        <SaveTemplate />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/submit/i));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
