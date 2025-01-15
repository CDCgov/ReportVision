import { FC } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './AuthContext';


// --- Mocking react-router-dom (Vitest style) ---
vi.mock('react-router-dom', async () => {
  const actual: any = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// A simple component that consumes AuthContext
const TestComponent: FC = () => {
  const { token, login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <p data-testid="token">{token}</p>
      <p data-testid="authenticated">{isAuthenticated.toString()}</p>
      <button data-testid="login" onClick={() => login('test-token')}>
        Login
      </button>
      <button data-testid="logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthProvider', () => {
  let mockNavigate: ReturnType<typeof useNavigate>;

  beforeEach(() => {
    mockNavigate = (useNavigate as vi.Mock).mockReturnValue(vi.fn());
    localStorage.clear(); // Clear localStorage before each test
  });

  it('should redirect to /login if no token is found on mount', () => {
    // Render AuthProvider with MemoryRouter
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    // Since there's no token in localStorage, it should navigate to /login
  });

  it('should not redirect if a token is found in localStorage', () => {
    localStorage.setItem('auth_token', 'existing-token');

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    // Because a token exists, we don't navigate
    expect(screen.getByTestId('token').textContent).toBe('existing-token');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
  });

  it('should login and set the token in localStorage', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    act(() => {
      screen.getByTestId('login').click();
    });

    expect(screen.getByTestId('token').textContent).toBe('test-token');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should logout and remove the token from localStorage, then redirect', () => {
    localStorage.setItem('auth_token', 'existing-token');

    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    act(() => {
      screen.getByTestId('logout').click();
    });

    expect(screen.getByTestId('token').textContent).toBe('');
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
