import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Properties - Property Management System',
  description: 'Comprehensive property management system. Register, update, and track properties with detailed information including location, type, area, and ownership details for efficient property tax assessment.',
  keywords: [
    'property management',
    'property registration',
    'property database',
    'property records',
    'property information',
    'property ownership',
    'property assessment',
    'municipal properties'
  ],
  openGraph: {
    title: 'Properties - Property Management System',
    description: 'Comprehensive property management system for municipal property tax assessment and administration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Properties - Property Management System',
    description: 'Comprehensive property management system for municipal property tax assessment and administration.',
  },
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}