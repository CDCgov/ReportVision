import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the imports
vi.mock('./components/AppHeader/AppHeader.tsx', () => ({
  AppHeader: () => <div data-testid="app-header">AppHeader</div>,
}));

vi.mock('./components/TemplatesIndex/TemplatesIndex.tsx', () => ({
  TemplatesIndex: () => <div data-testid="templates-index">TemplatesIndex</div>,
}));

vi.mock('./assets/comment.svg', () => ({
  default: 'comment.svg',
}));

vi.mock('./assets/csv.svg', () => ({
  default: 'csv.svg',
}));

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  it('renders the AppHeader component', () => {
    renderComponent();
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
  });

  it('displays first-time experience content on initial visit', () => {
    renderComponent();
    expect(screen.getByTestId('first-time-exp')).toBeInTheDocument();
  });

  it('displays regular content on subsequent visits', () => {
    localStorage.setItem('hasVisited', 'true');
    renderComponent();
    expect(screen.queryByTestId('first-time-exp')).not.toBeInTheDocument();
    expect(screen.getByTestId('templates-index')).toBeInTheDocument();
  });

  it('navigates to the correct URL when a navigation link is clicked (0)', () => {
    renderComponent();
    const navLink = screen.getByTestId('nav-link-0');
    fireEvent.click(navLink);
    expect(navLink).toHaveAttribute('href', '/');
  });

  it('navigates to the correct URL when a navigation link is clicked (1)', () => {
    renderComponent();
    const navLink = screen.getByTestId('nav-link-1');
    fireEvent.click(navLink);
    expect(navLink).toHaveAttribute('href', '/labels');
  });

  it('navigates to the correct URL when a navigation link is clicked (2)', () => {
    renderComponent();
    const navLink = screen.getByTestId('nav-link-2');
    fireEvent.click(navLink);
    expect(navLink).toHaveAttribute('href', '/dashboard');
  });

  it('navigates to the new template upload page when the button is clicked', () => {
    renderComponent();
    const newTemplateButton = screen.getByTestId('new-template-button');
    fireEvent.click(newTemplateButton);
    expect(window.location.pathname).toBe('/new-template/upload');
  });

  it('renders navigation links correctly', () => {
    renderComponent();
    const navLinks = ['Annotate and Extract', 'Label Management', 'Dashboard'];
    navLinks.forEach((_, idx) => {
      expect(screen.getByTestId(`nav-link-${idx}`)).toBeInTheDocument();
    });
  });
});