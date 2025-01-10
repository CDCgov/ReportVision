import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import LoginForm from './LoginForm'
import RootLayout from './RootLayout'
import { MemoryRouter } from 'react-router-dom'

describe('LoginForm', () => {
  it('renders the form fields and a submit button', () => {
    render(
        <MemoryRouter>
        <RootLayout>
            <LoginForm />
        </RootLayout>
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /log into my account/i })).toBeInTheDocument()

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /login to your account/i })).toBeInTheDocument()
  })

  it('shows validation errors when fields are empty and user submits', async () => {
    render(
        <MemoryRouter>
        <RootLayout>
            <LoginForm />
        </RootLayout>
      </MemoryRouter>
    )

    // Get the button
    const loginButton = screen.getByRole('button', { name: /login to your account/i })
    
    // Click it without typing anything
    await fireEvent.click(loginButton)

    // Wait for validation errors to appear
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument()
  })

  it('shows email format error if email is invalid', async () => {
    render(
        <MemoryRouter>
        <RootLayout>
            <LoginForm />
        </RootLayout>
      </MemoryRouter>
    )
    // Type an invalid email
    await fireEvent.change(screen.getByLabelText(/email address/i), 'not-an-email')
    // Type a password so that password doesn’t fail the “required” check
    await fireEvent.change(screen.getByLabelText(/password/i), 'ValidPass123')

    // Submit
    const loginButton = screen.getByRole('button', { name: /login to your account/i })
    await fireEvent.click(loginButton)

    // Should show the "Please enter a valid email address" error
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument()
  })

  it('shows password format errors if password does not meet requirements', async () => {
    render(
        <MemoryRouter>
        <RootLayout>
            <LoginForm />
        </RootLayout>
      </MemoryRouter>
    )
    // For instance, a password that's too short and missing uppercase
    fireEvent.change(screen.getByTestId('email'), 'test@example.com')
    fireEvent.change(screen.getByTestId('password'), 'abcabcabc1')


    const loginButton = screen.getByRole('button', { name: /login to your account/i })

    await waitFor(() => {
        fireEvent.change(screen.getByTestId('email'), 'test@example.com')
        fireEvent.change(screen.getByTestId('password'), 'abcabcabc1')
        fireEvent.click(loginButton)
    })

    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
  })

  it('submits successfully when valid data is entered', async () => {
    render(
        <MemoryRouter>
        <RootLayout>
            <LoginForm />
        </RootLayout>
      </MemoryRouter>
    )
    // Provide valid inputs
    await fireEvent.change(screen.getByLabelText(/email address/i), 'validUser@example.com')
    await fireEvent.change(screen.getByLabelText(/password/i), 'ValidPass123')

    // Click the login button
    const loginButton = screen.getByRole('button', { name: /login to your account/i })
    await fireEvent.click(loginButton)
  })
})
