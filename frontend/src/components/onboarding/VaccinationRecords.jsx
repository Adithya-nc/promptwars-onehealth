import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { CardContent, CardFooter } from '../ui/Card'
import { UploadCloud } from 'lucide-react'

export default function VaccinationRecords({ onBack }) {
  const navigate = useNavigate()
  const [vaccines, setVaccines] = useState([
    { name: 'BCG', date: '', checked: false },
    { name: 'Polio', date: '', checked: false },
    { name: 'Hepatitis B', date: '', checked: false },
    { name: 'MMR', date: '', checked: false },
    { name: 'COVID-19', date: '', checked: false },
  ])

  const toggleVaccine = (index) => {
    const newVax = [...vaccines]
    newVax[index].checked = !newVax[index].checked
    if (!newVax[index].checked) {
      newVax[index].date = ''
    }
    setVaccines(newVax)
  }

  const handleDateChange = (index, value) => {
    const newVax = [...vaccines]
    newVax[index].date = value
    setVaccines(newVax)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Finish onboarding -> go to dashboard
    navigate('/passport')
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <label className="text-sm font-medium">Common Vaccinations</label>
          <div className="space-y-3">
            {vaccines.map((vax, index) => (
              <div key={vax.name} className="flex items-center gap-4 p-3 border rounded-input bg-gray-50">
                <input 
                  type="checkbox" 
                  checked={vax.checked} 
                  onChange={() => toggleVaccine(index)}
                  className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <span className="flex-1 text-sm font-medium">{vax.name}</span>
                {vax.checked && (
                  <Input 
                    type="date" 
                    value={vax.date} 
                    onChange={(e) => handleDateChange(index, e.target.value)} 
                    className="w-40 h-8 text-xs" 
                    required 
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Vaccination Card (Optional)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-card p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <UploadCloud size={32} className="text-primary mb-2" />
            <p className="text-sm font-medium text-dark">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PDF, PNG, or JPG (max. 5MB)</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button type="submit">Complete Setup</Button>
      </CardFooter>
    </form>
  )
}
