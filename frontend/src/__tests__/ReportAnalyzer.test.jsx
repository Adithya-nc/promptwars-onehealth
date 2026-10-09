import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ReportAnalyzer from '../components/reports/ReportAnalyzer'

describe('ReportAnalyzer Component', () => {
  it('renders report analyzer title and description', () => {
    render(
      <BrowserRouter>
        <ReportAnalyzer />
      </BrowserRouter>
    )
    expect(screen.getByText(/AI Report Analyzer/i)).toBeInTheDocument()
    expect(screen.getByText(/Upload diagnostic medical records/i)).toBeInTheDocument()
  })

  it('renders report type selection buttons', () => {
    render(
      <BrowserRouter>
        <ReportAnalyzer />
      </BrowserRouter>
    )
    expect(screen.getByRole('button', { name: /Blood Test/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Radiology/i })).toBeInTheDocument()
  })

  it('renders document upload dropzone area', () => {
    render(
      <BrowserRouter>
        <ReportAnalyzer />
      </BrowserRouter>
    )
    expect(screen.getByText(/Drag & Drop Medical Report/i)).toBeInTheDocument()
    expect(screen.getByText(/Supports PDF, JPG, PNG/i)).toBeInTheDocument()
  })
})
