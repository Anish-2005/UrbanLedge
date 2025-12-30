// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://urbanledge.com'),
  title: {
    default: 'UrbanLedge - Professional Property Tax Management System',
    template: '%s | UrbanLedge'
  },
  description: 'Streamline property tax assessment, collection, and management with UrbanLedge. Professional municipal tax software for efficient property tax administration, payment processing, and financial reporting.',
  keywords: [
    'property tax management',
    'municipal tax software',
    'property assessment',
    'tax collection',
    'property management system',
    'municipal software',
    'tax administration',
    'property valuation',
    'tax payment processing',
    'urban planning software',
    'local government software',
    'property records management'
  ],
  authors: [{ name: 'UrbanLedge Team' }],
  creator: 'UrbanLedge',
  publisher: 'UrbanLedge',
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
    url: 'https://urbanledge.com',
    title: 'UrbanLedge - Professional Property Tax Management System',
    description: 'Streamline property tax assessment, collection, and management with UrbanLedge. Professional municipal tax software for efficient property tax administration.',
    siteName: 'UrbanLedge',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UrbanLedge Property Tax Management System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrbanLedge - Professional Property Tax Management System',
    description: 'Streamline property tax assessment, collection, and management with UrbanLedge. Professional municipal tax software for efficient property tax administration.',
    images: ['/og-image.jpg'],
    creator: '@urbanledge',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: 'https://urbanledge.com',
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
    "name": "UrbanLedge",
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
      "name": "UrbanLedge",
      "url": "https://urbanledge.com"
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
    "screenshot": "/og-image.jpg"
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
        <link rel="canonical" href="https://urbanledge.vercel.app" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}