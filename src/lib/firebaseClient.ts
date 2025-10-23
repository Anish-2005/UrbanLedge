"use client"
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth'

// Firebase configuration must come from environment variables (NEXT_PUBLIC_*).
// Do NOT store API keys or app secrets directly in source. Set them in your environment
// or in a secrets manager and expose only NEXT_PUBLIC_* values needed by the client.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Helpful runtime warning for local dev when env vars are missing
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    // eslint-disable-next-line no-console
    console.warn('[firebaseClient] Missing Firebase environment variables. Please set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID.')
  }
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
