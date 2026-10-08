import React, { useState } from 'react'
import { Card, CardContent } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Search } from 'lucide-react'

const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Fatigue', 'Nausea',
  'Body Ache', 'Sore Throat', 'Shortness of Breath', 'Dizziness', 'Chest Pain'
]

export default function SymptomInput({ onAnalyze }) {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [duration, setDuration] = useState('')
  const [customSymptom, setCustomSymptom] = useState('')

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom])
    }
  }

  const handleAddCustom = (e) => {
    e.preventDefault()
    if (customSymptom && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom])
      setCustomSymptom('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onAnalyze({ symptoms: selectedSymptoms, duration })
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">What are you feeling?</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSymptoms.map(symptom => (
              <span key={symptom} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-chip text-sm font-medium">
                {symptom}
                <button type="button" onClick={() => toggleSymptom(symptom)} className="hover:text-primary-hover ml-1">&times;</button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddCustom} className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              className="pl-10" 
              placeholder="Type a symptom e.g., runny nose and press Enter"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
            />
          </form>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Common Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map(symptom => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-3 py-1.5 rounded-chip text-sm border transition-colors ${
                    selectedSymptoms.includes(symptom) 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white text-dark border-gray-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-900">How long have you had these symptoms?</label>
          <div className="flex flex-wrap gap-2">
            {['< 1 day', '1-3 days', '4-7 days', '1-2 weeks', '> 2 weeks'].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`px-4 py-2 rounded-chip text-sm border transition-colors ${
                  duration === d 
                  ? "bg-accent text-white border-accent" 
                  : "bg-white text-dark border-gray-300 hover:border-accent hover:text-accent"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <Button 
          className="w-full h-12 text-lg mt-4" 
          onClick={handleSubmit}
          disabled={selectedSymptoms.length === 0 || !duration}
        >
          Analyze Symptoms
        </Button>
      </CardContent>
    </Card>
  )
}
