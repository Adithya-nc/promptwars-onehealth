import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('OneHealth Application Root & Routing', () => {
  it('renders application landing page with OneHealth branding', () => {
    render(<App />)
    const brandElements = screen.getAllByText(/OneHealth/i)
    expect(brandElements.length).toBeGreaterThan(0)
  })

  it('renders critical navigation links', () => {
    render(<App />)
    const navButtons = screen.getAllByRole('button')
    expect(navButtons.length).toBeGreaterThan(0)
  })
})
