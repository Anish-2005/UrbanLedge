const FALLBACK_SITE_URL = 'https://urbanledge.vercel.app'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || FALLBACK_SITE_URL

export const SITE_NAME = 'UrbanLedge'
export const DEFAULT_OG_IMAGE = '/urbanledge.png'
