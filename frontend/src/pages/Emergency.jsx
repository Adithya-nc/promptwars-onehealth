import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EmergencyCardView from '../components/emergency/EmergencyCardView'
import { Button } from '../components/ui/Button'
import { Share2, Mic, AlertTriangle } from 'lucide-react'

export default function Emergency() {
  const [isGuidanceMode, setIsGuidanceMode] = useState(false)
  const [guidanceResult, setGuidanceResult] = useState(null)

  const handleGetGuidance = () => {
    // Mock getting guidance
    setGuidanceResult({
      riskLevel: 'critical',
      condition: 'Possible Cardiac Event',
      instructions: [
        'Call emergency services (112) immediately.',
        'Have the patient sit down, rest, and try to keep calm.',
        'Loosen any tight clothing.',
        'Ask if the patient takes any chest pain medication (like nitroglycerin) and help them take it.'
      ]
    })
  }

  return (
    <div className="min-h-screen bg-red-50 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EmergencyCardView />
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1 text-lg font-bold shadow-lg" onClick={() => setIsGuidanceMode(true)}>
            <AlertTriangle size={24} className="mr-2" />
            Get Emergency Guidance
          </Button>
          <Button size="lg" variant="outline" className="flex-1 bg-white shadow-lg text-lg font-bold">
            <Share2 size={24} className="mr-2 text-primary" />
            Share Emergency Info
          </Button>
        </div>

        <AnimatePresence>
          {isGuidanceMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-card shadow-lg p-6 border border-gray-100 mt-6">
                <h3 className="text-xl font-bold text-dark mb-4">Describe Emergency Symptoms</h3>
                
                {!guidanceResult ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="E.g., severe chest pain, left arm numbness" 
                        className="flex-1 h-12 rounded-input border border-gray-300 px-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                      <Button size="icon" className="h-12 w-12 rounded-input bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-none border border-gray-300">
                        <Mic size={24} />
                      </Button>
                    </div>
                    <Button className="w-full h-12 text-lg" onClick={handleGetGuidance}>
                      Get AI Guidance
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {guidanceResult.riskLevel === 'critical' && (
                      <div className="bg-danger text-white p-4 rounded-lg font-bold text-lg flex items-center gap-3 animate-pulse">
                        <AlertTriangle size={28} />
                        CALL 112 IMMEDIATELY
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-500 uppercase tracking-wider text-sm mb-1">Possible Condition</h4>
                      <p className="text-xl font-bold text-dark">{guidanceResult.condition}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-500 uppercase tracking-wider text-sm mb-2">Immediate Instructions</h4>
                      <ul className="space-y-3">
                        {guidanceResult.instructions.map((inst, i) => (
                          <li key={i} className="flex gap-3 text-lg font-medium text-gray-800">
                            <span className="w-8 h-8 rounded-full bg-red-100 text-danger flex items-center justify-center flex-shrink-0 font-bold">{i+1}</span>
                            {inst}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full mt-4" onClick={() => setGuidanceResult(null)}>
                      Start Over
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
