import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import api from './api'

export const authService = {
  // Register a new user
  async registerUser(email, password, displayName, role = 'patient', extraData = {}) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await updateProfile(user, { displayName })

    // Store additional user profile data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      role, // 'patient' or 'doctor'
      createdAt: new Date().toISOString(),
      ...extraData
    })

    return user
  },

  // Login user
  async loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  },

  // Logout user
  async logout() {
    await signOut(auth)
  },

  // Fetch full user profile from Firestore
  async getUserProfile(uid) {
    const docRef = doc(db, 'users', uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data()
    }
    return null
  },

  // Update user profile in Firestore
  async updateUserProfile(uid, data) {
    await setDoc(doc(db, 'users', uid), data, { merge: true })
  }
}
