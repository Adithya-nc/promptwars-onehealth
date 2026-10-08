import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'

export const medicationService = {
  async getMedications(userId) {
    const medsRef = collection(db, 'medications')
    const q = query(medsRef, where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  async addMedication(userId, medData) {
    const medId = medData.id || `med-${Date.now()}`
    const docRef = doc(db, 'medications', medId)
    await setDoc(docRef, { ...medData, userId, createdAt: new Date().toISOString() })
    return medId
  },

  async updateMedication(medId, data) {
    const docRef = doc(db, 'medications', medId)
    await setDoc(docRef, data, { merge: true })
  },

  async deleteMedication(medId) {
    await deleteDoc(doc(db, 'medications', medId))
  }
}
