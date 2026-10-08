import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { X, UploadCloud } from 'lucide-react'

export default function UploadModal({ isOpen, onClose }) {
  const [isUploading, setIsUploading] = useState(false)

  if (!isOpen) return null

  const handleUpload = (e) => {
    e.preventDefault()
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-card shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Upload Health Record</h2>
            <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-100 rounded-md">
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleUpload} className="p-6 space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Record Type</label>
              <select className="flex h-10 w-full rounded-input border border-gray-300 bg-white px-3 py-2 text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary" required>
                <option value="report">Lab Report</option>
                <option value="prescription">Prescription</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">File Upload</label>
              <div className="border-2 border-dashed border-gray-300 rounded-card p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <UploadCloud size={40} className="text-primary mb-3" />
                <p className="text-sm font-medium text-dark">Drag & drop your file here</p>
                <p className="text-xs text-gray-500 mt-1">Supports PDF, JPG, PNG (Max 20MB)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date of Record</label>
                <Input type="date" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Doctor Name (Optional)</label>
                <Input placeholder="Dr. Smith" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Input placeholder="Any additional details..." />
            </div>
          </form>
          
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="button" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload & Save'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
