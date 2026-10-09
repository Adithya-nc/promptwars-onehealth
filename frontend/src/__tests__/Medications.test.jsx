import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Medications from '../components/medications/Medications'

describe('Medications Component', () => {
  it('renders medication management header and tracker', () => {
    render(
      <BrowserRouter>
        <Medications />
      </BrowserRouter>
    )
    expect(screen.getByText(/Medication Schedule & Adherence/i)).toBeInTheDocument()
    expect(screen.getByText(/Track prescriptions, view adherence trends/i)).toBeInTheDocument()
  })

  it('renders add medication button', () => {
    render(
      <BrowserRouter>
        <Medications />
      </BrowserRouter>
    )
    const addBtn = screen.getByRole('button', { name: /Add Medication/i })
    expect(addBtn).toBeInTheDocument()
  })

  it('renders filter tabs for active and completed', () => {
    render(
      <BrowserRouter>
        <Medications />
      </BrowserRouter>
    )
    expect(screen.getByRole('button', { name: /active/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /completed/i })).toBeInTheDocument()
  })
})
