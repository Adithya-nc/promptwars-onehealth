import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Passport from '../components/passport/Passport'

describe('Passport Component', () => {
  it('renders digital health passport header and subtitle', () => {
    render(
      <BrowserRouter>
        <Passport />
      </BrowserRouter>
    )
    expect(screen.getByText(/Health Passport/i)).toBeInTheDocument()
    expect(screen.getByText(/Your complete lifelong medical record/i)).toBeInTheDocument()
  })

  it('renders search input and category filter buttons', () => {
    render(
      <BrowserRouter>
        <Passport />
      </BrowserRouter>
    )
    expect(screen.getByPlaceholderText(/Search your health records/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^All$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Reports$/i })).toBeInTheDocument()
  })

  it('renders add record action button', () => {
    render(
      <BrowserRouter>
        <Passport />
      </BrowserRouter>
    )
    const addBtn = screen.getByRole('button', { name: /Add Record/i })
    expect(addBtn).toBeInTheDocument()
  })
})
