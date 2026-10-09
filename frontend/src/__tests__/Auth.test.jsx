import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Login, Register } from '../pages/Auth'

describe('Authentication Flow', () => {
  it('renders login form elements and submit button', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/priya@example.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument()
  })

  it('renders registration form elements', () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument()
  })
})
