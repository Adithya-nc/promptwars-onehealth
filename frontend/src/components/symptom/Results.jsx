import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { AlertCircle, AlertTriangle, CheckCircle, ChevronRight, Download, Save } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Results({ onReset }) {
  // Mock Results data
  const result = {
    severity: 'Medium Risk', // 'Low Risk', 'Medium Risk', 'High Risk'
    severityColor: 'bg-yellow-500',
    icon: <AlertTriangle size={24} className="text-white" />,
    explanation: 'Based on your symptoms (Fever, Cough) for 1-3 days, this could be a common respiratory infection.',
    conditions: [
      { name: 'Viral URI (Common Cold)', explanation: 'A viral infection of your nose and throat.' },
      { name: 'Influenza (Flu)', explanation: 'A viral infection that attacks your respiratory system.' }
    ],
    recommendations: [
      'Get plenty of rest and stay hydrated.',
      'Monitor your temperature every 4-6 hours.',
      'Use a humidifier or take steamy showers to relieve congestion.'
    ],
    otc: [
      { medicine: 'Paracetamol (500mg)', dosage: '1 tablet every 6 hours for fever' },
      { medicine: 'Saline Nasal Spray', dosage: 'As needed for congestion' }
    ],
    warnings: [
      'If fever exceeds 103°F (39.4°C)',
      'If you experience shortness of breath or chest pain'
    ]
  }

  return (
    <div className="space-y-6">
      {/* Severity Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-card overflow-hidden shadow-subtle border border-gray-100 bg-white"
      >
        <div className={`${result.severityColor} p-4 flex items-center gap-3`}>
          {result.icon}
          <h2 className="text-xl font-bold text-white">{result.severity}</h2>
        </div>
        <div className="p-5">
          <p className="text-gray-700 text-lg">{result.explanation}</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Conditions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Possible Conditions</h3>
          <div className="space-y-3">
            {result.conditions.map((cond, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-dark">{cond.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{cond.explanation}</p>
                  <button className="text-primary text-sm font-medium flex items-center mt-2 hover:underline">
                    Learn More <ChevronRight size={14} />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-gray-400 italic">This is AI guidance only. Consult a qualified doctor for diagnosis.</p>
        </div>

        <div className="space-y-6">
          {/* Actionable Recommendations */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">What to do now</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">{i+1}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* OTC Suggestions */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">OTC Suggestions</h3>
            <div className="flex flex-wrap gap-2">
              {result.otc.map((item, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm">
                  <div className="font-semibold text-dark">{item.medicine}</div>
                  <div className="text-xs text-gray-500">{item.dosage}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Signs */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-card p-4 space-y-2">
            <h4 className="font-bold text-yellow-800 flex items-center gap-2">
              <AlertCircle size={18} /> Seek Medical Attention if:
            </h4>
            <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
              {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1" onClick={() => {}}>
          <Save size={18} className="mr-2" /> Save to Passport
        </Button>
        <Button variant="outline" className="flex-1" onClick={onReset}>
          Start Over
        </Button>
      </div>
    </div>
  )
}
