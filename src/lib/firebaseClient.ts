"use client"
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth'

// Provided Firebase config (will be used as defaults). You can override via NEXT_PUBLIC_* env vars.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyC3DGyNMgmKcFbfeUG-A1iu779C3_TV-u8',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'urbanledge-f926f.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'urbanledge-f926f',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'urbanledge-f926f.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '260137984173',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:260137984173:web:111b3b849437a9764b2624',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-699MB2XY2W'
}

if (!getApps().length) {
  try { initializeApp(firebaseConfig) } catch (e) { /* ignore in dev without config */ }
}

export const auth = typeof window !== 'undefined' ? getAuth() : null
export const provider = typeof window !== 'undefined' ? new GoogleAuthProvider() : null

// Keep an in-flight sign-in promise to avoid triggering multiple popups which
// causes the `auth/cancelled-popup-request` error when a previous popup was
// superseded or blocked.
let inFlightSignIn: Promise<any> | null = null

export async function signInWithGoogle() {
  if (!auth || !provider) throw new Error('Auth not initialized')

  // If there's already a popup in progress, await and reuse its result.
  if (inFlightSignIn) {
    try {
      const existing = await inFlightSignIn
      return existing.user
    } catch (err) {
      // If the previous attempt failed, clear and continue to attempt a new sign-in.
      inFlightSignIn = null
    }
  }

  inFlightSignIn = signInWithPopup(auth, provider)
  try {
    const res = await inFlightSignIn
    return res.user
  } catch (err: any) {
    // Known popup-related errors can be retried with a redirect flow.
    const code = err?.code ?? err?.message
    if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-blocked') {
      // Clear the in-flight promise before redirecting.
      inFlightSignIn = null
      // signInWithRedirect will navigate away; callers should handle that.
      await signInWithRedirect(auth, provider)
      // Indicate redirect was initiated. The app should wait for onAuthStateChanged or
      // getRedirectResult in the redirect landing page.
      throw new Error('Redirect initiated for sign-in')
    }
    throw err
  } finally {
    inFlightSignIn = null
  }
}

export function onAuthChange(cb: (user: any) => void) {
  if (!auth) return () => {}
  return onAuthStateChanged(auth, (u) => cb(u))
}

export async function getIdToken(): Promise<string | null> {
  if (!auth || !auth.currentUser) return null
  return auth.currentUser.getIdToken()
}
