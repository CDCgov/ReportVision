// LoginPage.test.tsx
import { describe, it, expect } from 'vitest'
import { vi } from 'vitest' // Add this line to import the 'vi' namespace
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'

// IMPORTANT: We mock react-router-dom so we can observe `useNavigate`.
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
      ...actual,
      useNavigate: vi.fn(), // This is crucial
    }
  })

import LoginPage from './LoginPage'
import RootLayout from '../components/RootLayout'

describe('LoginPage', () => {
  it('renders the header with the correct text', () => {
    const navigateMock = vi.fn();
    (useNavigate as unknown as vi.Mock).mockReturnValue(navigateMock)
    
    render(
      <MemoryRouter>
        <RootLayout>
            <LoginPage />
        </RootLayout>
      </MemoryRouter>
    )

    // Check if the header text "ReportVision" is on the screen
    expect(screen.getByText(/ReportVision/i)).toBeInTheDocument()

    // Check if the image with alt="IDWA" is on the screen
    expect(screen.getByAltText('IDWA')).toBeInTheDocument()
  })

  it('navigates to /login when the logo button is clicked', async () => {
    // We’ll capture the mock from our mock factory
    const navigateMock = vi.fn();
    (useNavigate as unknown as vi.Mock).mockReturnValue(navigateMock)

    render(
        <MemoryRouter>
          <RootLayout>
              <LoginPage />
          </RootLayout>
        </MemoryRouter>
      )

    // The button that wraps the logo
    const logoButton = screen.getByRole('button', { name: /idwa/i })
    await fireEvent.click(logoButton)

    // Expect useNavigate to have been called with "/login"
    expect(navigateMock).toHaveBeenCalledTimes(2)
    expect(navigateMock).toHaveBeenCalledWith('/login')
  })

  it('renders the login form', () => {
    render(
        <MemoryRouter>
          <RootLayout>
              <LoginPage />
          </RootLayout>
        </MemoryRouter>
      )

    // The LoginForm includes a "Log into my account" heading
    expect(screen.getByRole('heading', { name: /log into my account/i })).toBeInTheDocument()

    // The "Login" button
    expect(screen.getByRole('button', { name: /login to your account/i })).toBeInTheDocument()
  })
})
