import React from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { CardContent, CardFooter } from '../ui/Card'

export default function BasicInfo({ onNext }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Birth</label>
            <Input type="date" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <select className="flex h-10 w-full rounded-input border border-gray-300 bg-white px-3 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary" required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Blood Group</label>
          <select className="flex h-10 w-full rounded-input border border-gray-300 bg-white px-3 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary" required>
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Height (cm)</label>
            <Input type="number" placeholder="170" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Weight (kg)</label>
            <Input type="number" placeholder="70" required />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full">Continue</Button>
      </CardFooter>
    </form>
  )
}
