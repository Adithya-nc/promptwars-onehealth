import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SymptomInput from '../components/symptom/SymptomInput'
import Results from '../components/symptom/Results'
import { Stethoscope } from 'lucide-react'

export default function SymptomAnalyzer() {
  const [analysisState, setAnalysisState] = useState('input') // 'input', 'loading', 'results'

  const handleAnalyze = (data) => {
    setAnalysisState('loading')
    // Mock API call
    setTimeout(() => {
      setAnalysisState('results')
    }, 2500)
  }

  const handleReset = () => {
    setAnalysisState('input')
  }

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-2">
          <Stethoscope size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-dark">AI Symptom Analyzer</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Describe how you're feeling, and our AI will provide personalized guidance and recommendations.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {analysisState === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <SymptomInput onAnalyze={handleAnalyze} />
          </motion.div>
        )}

        {analysisState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-dark animate-pulse">Analyzing your symptoms with AI...</p>
          </motion.div>
        )}

        {analysisState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <Results onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
