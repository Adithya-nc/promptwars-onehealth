import React, { useState } from 'react'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { CardContent, CardFooter } from '../ui/Card'
import { Plus, Trash2 } from 'lucide-react'

export default function EmergencyContacts({ onNext, onBack }) {
  const [contacts, setContacts] = useState([{ name: '', relationship: '', phone: '' }])

  const addContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: '', relationship: '', phone: '' }])
    }
  }

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  const handleChange = (index, field, value) => {
    const newContacts = [...contacts]
    newContacts[index][field] = value
    setContacts(newContacts)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6 pt-6">
        {contacts.map((contact, index) => (
          <div key={index} className="space-y-4 p-4 border border-gray-100 rounded-card bg-gray-50 relative">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-gray-700">Contact {index + 1}</h4>
              {contacts.length > 1 && (
                <button type="button" onClick={() => removeContact(index)} className="text-gray-400 hover:text-danger">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={contact.name} onChange={(e) => handleChange(index, 'name', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Relationship</label>
                <select 
                  className="flex h-10 w-full rounded-input border border-gray-300 bg-white px-3 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  value={contact.relationship}
                  onChange={(e) => handleChange(index, 'relationship', e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input type="tel" value={contact.phone} onChange={(e) => handleChange(index, 'phone', e.target.value)} required />
              </div>
            </div>
          </div>
        ))}

        {contacts.length < 3 && (
          <Button type="button" variant="outline" className="w-full flex items-center gap-2" onClick={addContact}>
            <Plus size={16} /> Add Another Contact
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>Back</Button>
        <Button type="submit">Continue</Button>
      </CardFooter>
    </form>
  )
}
