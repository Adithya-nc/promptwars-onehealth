import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SymptomAnalyzer from '../components/symptom/SymptomAnalyzer'

describe('SymptomAnalyzer Component', () => {
  it('renders symptom analyzer interface and title', () => {
    render(
      <BrowserRouter>
        <SymptomAnalyzer />
      </BrowserRouter>
    )
    expect(screen.getByText(/AI Symptom Analyzer/i)).toBeInTheDocument()
    expect(screen.getByText(/Select Reported Symptoms/i)).toBeInTheDocument()
  })

  it('renders quick symptom selection and active symptoms', () => {
    render(
      <BrowserRouter>
        <SymptomAnalyzer />
      </BrowserRouter>
    )
    expect(screen.getAllByText(/Fever/i).length).toBeGreaterThan(0)
    expect(screen.getByPlaceholderText(/Type any other symptom/i)).toBeInTheDocument()
  })

  it('renders analyze button with accessible text', () => {
    render(
      <BrowserRouter>
        <SymptomAnalyzer />
      </BrowserRouter>
    )
    const analyzeBtn = screen.getByRole('button', { name: /Analyze with AI/i })
    expect(analyzeBtn).toBeInTheDocument()
  })
})
