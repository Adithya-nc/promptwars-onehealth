import React, { useState } from 'react'
import { Card, CardContent } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Search, Filter, ChevronRight, FileText, Pill, Stethoscope, Syringe } from 'lucide-react'

// Mock Data
const timelineData = [
  { id: 1, type: 'Report', date: '2026-06-01', title: 'Complete Blood Count (CBC)', doctor: 'Dr. Arjun', summary: 'All parameters normal. Hemoglobin slightly low.' },
  { id: 2, type: 'Prescription', date: '2026-05-15', title: 'Asthma Inhaler Refill', doctor: 'Dr. Sharma', summary: 'Salbutamol 100mcg, 2 puffs SOS' },
  { id: 3, type: 'Diagnosis', date: '2026-04-10', title: 'Viral Pharyngitis', doctor: 'Dr. Verma', summary: 'Prescribed rest and paracetamol for 3 days.' },
  { id: 4, type: 'Vaccination', date: '2026-01-20', title: 'COVID-19 Booster', doctor: 'Apollo Clinic', summary: 'Covishield Booster Dose' },
]

export default function HealthTimeline() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const getIcon = (type) => {
    switch(type) {
      case 'Report': return <FileText size={18} className="text-blue-500" />
      case 'Prescription': return <Pill size={18} className="text-green-500" />
      case 'Diagnosis': return <Stethoscope size={18} className="text-purple-500" />
      case 'Vaccination': return <Syringe size={18} className="text-orange-500" />
      default: return <FileText size={18} />
    }
  }

  const filteredData = timelineData.filter(item => {
    if (filter !== 'All' && item.type !== filter) return false
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10" 
            placeholder="Search records..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
          {['All', 'Report', 'Prescription', 'Diagnosis', 'Vaccination'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-chip text-sm whitespace-nowrap transition-colors ${
                filter === f ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map(item => (
          <Card key={item.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex gap-4 items-start sm:items-center">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                  <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 w-fit">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">By {item.doctor} • {new Date(item.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 truncate">{item.summary}</p>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0" />
            </CardContent>
          </Card>
        ))}
        
        {filteredData.length === 0 && (
          <div className="text-center py-12 bg-white rounded-card border border-gray-100">
            <p className="text-gray-500">No records found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
