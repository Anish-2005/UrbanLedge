// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { UIProvider } from '@/contexts/UIContext'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Property Tax Management Platform`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Manage municipal property tax assessments, collections, and reporting in one platform built for city operations.',
  keywords: [
    'property tax management',
    'municipal software',
    'tax assessment',
    'tax collection',
    'property records',
    'local government platform',
  ],
  authors: [{ name: `${SITE_NAME} Team` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Government & Municipal Software',
  classification: 'Property Tax Management Software',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: `${SITE_NAME} - Property Tax Management Platform`,
    description:
      'A professional platform for property tax assessment, payment processing, and municipal reporting.',
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} dashboard`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Property Tax Management Platform`,
    description:
      'A professional platform for municipal tax assessment, payments, and reporting.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": SITE_NAME,
    "description": "Professional property tax management system for municipal governments",
    "applicationCategory": "GovernmentApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "featureList": [
      "Property Assessment Management",
      "Tax Collection & Payment Processing",
      "Financial Reporting",
      "User Management",
      "Ward & Zone Management",
      "Tax Slab Configuration",
      "Exemption Management",
      "Audit Trail & Activity Logging"
    ],
    "screenshot": DEFAULT_OG_IMAGE,
    "url": SITE_URL
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={manrope.className}>
        <ThemeProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
