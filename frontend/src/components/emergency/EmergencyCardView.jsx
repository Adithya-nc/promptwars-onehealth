import React, { useState } from 'react'
import { Card, CardContent } from '../ui/Card'
import { Phone, AlertCircle, Heart, Pill, Stethoscope, Droplet, Copy, Check } from 'lucide-react'
import { useUserStore } from '../../store/userStore'

export default function EmergencyCardView({ profile }) {
  const storeProfile = useUserStore(s => s.profile)
  const patientId = profile?.patient_id || storeProfile?.patient_id || 'OH-P-AAAB2C3'
  const [copiedId, setCopiedId] = useState(false)

  const handleCopyId = () => {
    navigator.clipboard.writeText(patientId)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  // Use mock data if profile is not provided
  const patient = profile || {
    name: storeProfile?.name || 'Priya Sharma',
    age: 34,
    bloodGroup: storeProfile?.profile?.blood_group || 'O+',
    allergies: storeProfile?.profile?.allergies || ['Penicillin', 'Peanuts'],
    chronicDiseases: storeProfile?.profile?.chronic_diseases || ['Asthma', 'Hypertension'],
    medications: [
      { name: 'Salbutamol 100mcg', dosage: '2 puffs SOS' },
      { name: 'Amlodipine 5mg', dosage: '1 tablet daily' }
    ],
    contacts: storeProfile?.profile?.emergency_contacts || [
      { name: 'Rahul Sharma', relationship: 'Spouse', phone: '+91 98765 43211' },
      { name: 'Dr. Arjun', relationship: 'Family Doctor', phone: '+91 98765 00000' }
    ]
  }

  return (
    <Card className="border-danger/30 shadow-lg overflow-hidden bg-white">
      {/* Red Header */}
      <div className="bg-danger p-6 text-white text-center relative">
        <AlertCircle size={48} className="mx-auto mb-2 opacity-90" />
        <h2 className="text-2xl font-bold tracking-tight uppercase">Emergency Card</h2>
        <p className="text-danger-100 font-medium opacity-90">MEDICAL INFORMATION</p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white font-mono text-xs font-bold mt-2.5">
          <span>Patient ID: {patientId}</span>
          <button onClick={handleCopyId} title="Copy Patient ID" className="hover:opacity-80 p-0.5">
            {copiedId ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
          </button>
        </div>
      </div>

      <CardContent className="p-0">
        {/* Basic Info & Blood Group */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/50">
          <div>
            <h3 className="text-2xl font-bold text-dark">{patient.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-600 font-medium">{patient.age} years old</p>
              <span className="text-gray-300">•</span>
              <span className="font-mono text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                ID: {patientId}
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-danger text-white w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-sm">
              {patient.bloodGroup}
            </div>
            <p className="text-xs text-danger font-bold mt-1 uppercase tracking-wide">Blood</p>
          </div>
        </div>

        {/* Medical Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b border-gray-100">
          {/* Allergies & Diseases */}
          <div className="p-6 space-y-6">
            <div>
              <h4 className="flex items-center gap-2 font-bold text-dark mb-3 text-lg">
                <AlertCircle size={20} className="text-danger" /> Known Allergies
              </h4>
              {patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map(a => (
                    <span key={a} className="bg-red-100 text-red-800 px-3 py-1 rounded-md font-semibold text-sm border border-red-200">
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 font-medium">None Known</p>
              )}
            </div>

            <div>
              <h4 className="flex items-center gap-2 font-bold text-dark mb-3 text-lg">
                <Heart size={20} className="text-orange-500" /> Chronic Diseases
              </h4>
              {patient.chronicDiseases.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {patient.chronicDiseases.map(d => (
                    <li key={d} className="font-semibold text-gray-800">{d}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 font-medium">None Known</p>
              )}
            </div>
          </div>

          {/* Medications & Contacts */}
          <div className="p-6 space-y-6">
            <div>
              <h4 className="flex items-center gap-2 font-bold text-dark mb-3 text-lg">
                <Pill size={20} className="text-blue-500" /> Current Medications
              </h4>
              {patient.medications.length > 0 ? (
                <div className="space-y-3">
                  {patient.medications.map(m => (
                    <div key={m.name} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="font-bold text-dark">{m.name}</div>
                      <div className="text-sm text-gray-600 font-medium">{m.dosage}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 font-medium">None</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="p-6 bg-gray-50">
          <h4 className="flex items-center gap-2 font-bold text-dark mb-4 text-lg">
            <Phone size={20} className="text-green-600" /> Emergency Contacts
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {patient.contacts.map(c => (
              <a 
                key={c.name} 
                href={`tel:${c.phone}`}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="font-bold text-dark">{c.name}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{c.relationship}</div>
                </div>
                <div className="bg-green-100 p-3 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <Phone size={20} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
