import React, { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { CardContent, CardFooter } from '../ui/Card'

export default function MedicalBackground({ onNext, onBack }) {
  const [allergies, setAllergies] = useState(['Penicillin'])
  const [conditions, setConditions] = useState(['Asthma'])
  const [allergyInput, setAllergyInput] = useState('')

  const handleAddAllergy = () => {
    if (allergyInput && !allergies.includes(allergyInput)) {
      setAllergies([...allergies, allergyInput])
      setAllergyInput('')
    }
  }

  const removeAllergy = (item) => {
    setAllergies(allergies.filter(a => a !== item))
  }
  
  const toggleCondition = (condition) => {
    if (conditions.includes(condition)) {
      setConditions(conditions.filter(c => c !== condition))
    } else {
      setConditions([...conditions, condition])
    }
  }

  const commonConditions = ["Diabetes", "Hypertension", "Asthma", "Thyroid", "Heart Disease"]

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">Known Allergies</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {allergies.map(allergy => (
              <span key={allergy} className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-chip text-sm">
                {allergy}
                <button type="button" onClick={() => removeAllergy(allergy)} className="text-red-500 hover:text-red-700 ml-1">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="E.g. Peanuts, Dust..." 
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAllergy(); }}}
            />
            <Button type="button" variant="outline" onClick={handleAddAllergy}>Add</Button>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-medium">Chronic Diseases</label>
          <div className="flex flex-wrap gap-2">
            {commonConditions.map(condition => (
              <button
                key={condition}
                type="button"
                onClick={() => toggleCondition(condition)}
                className={`px-4 py-2 rounded-chip text-sm border transition-colors ${
                  conditions.includes(condition) 
                  ? "bg-primary text-white border-primary" 
                  : "bg-white text-dark border-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Any other medical notes</label>
          <textarea 
            className="w-full rounded-input border border-gray-300 bg-white px-3 py-2 text-sm text-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
            placeholder="Additional information..."
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button type="submit">Continue</Button>
      </CardFooter>
    </form>
  )
}
