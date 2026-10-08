import { useState, useCallback } from 'react'
import { recordsService } from '../services/recordsService'
import { useRecordsStore } from '../store/recordsStore'
import { useToast } from '../components/ui/Toast'

export function useRecords() {
  const [loading, setLoading] = useState(false)
  const setRecords = useRecordsStore(s => s.setRecords)
  const addRecord = useRecordsStore(s => s.addRecord)
  const removeRecord = useRecordsStore(s => s.removeRecord)
  const toast = useToast()

  const fetchRecords = useCallback(async (userId) => {
    setLoading(true)
    try {
      const data = await recordsService.getUserRecords(userId)
      setRecords(data)
    } catch (error) {
      toast.error('Failed to fetch records', error.message)
    } finally {
      setLoading(false)
    }
  }, [setRecords, toast])

  const uploadAndAnalyzeRecord = async (file, userId) => {
    setLoading(true)
    try {
      // 1. Upload to Firebase Storage
      const fileUrl = await recordsService.uploadFile(file, userId)
      
      // 2. Pass to Backend API for AI parsing
      const aiAnalysis = await recordsService.parseMedicalReport(fileUrl, file.type)
      
      // 3. Save to Firestore
      const newRecord = {
        title: file.name,
        type: 'report',
        date: new Date().toISOString().split('T')[0],
        fileUrl,
        metadata: { ai_processed: true },
        ai_analysis: aiAnalysis
      }
      const recordId = await recordsService.saveRecord(userId, newRecord)
      
      // 4. Update local state
      addRecord({ id: recordId, ...newRecord })
      toast.success('Upload Complete', 'Your report has been analyzed and saved.')
      
      return recordId
    } catch (error) {
      toast.error('Upload Failed', error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteRecord = async (recordId) => {
    try {
      await recordsService.deleteRecord(recordId)
      removeRecord(recordId)
      toast.info('Record Deleted', 'The medical record has been removed.')
    } catch (error) {
      toast.error('Delete Failed', error.message)
    }
  }

  return { fetchRecords, uploadAndAnalyzeRecord, deleteRecord, loading }
}
