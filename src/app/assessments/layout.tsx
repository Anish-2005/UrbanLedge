import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assessments - Property Tax Assessment Management',
  description: 'Property tax assessment management system. Create, view, and manage property tax assessments with automated calculations, financial year tracking, and comprehensive assessment records.',
  keywords: [
    'property tax assessment',
    'tax assessment',
    'property valuation',
    'tax calculation',
    'assessment management',
    'property tax records',
    'municipal assessment',
    'tax assessment software'
  ],
  openGraph: {
    title: 'Assessments - Property Tax Assessment Management',
    description: 'Property tax assessment management system with automated calculations and comprehensive records.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assessments - Property Tax Assessment Management',
    description: 'Property tax assessment management system with automated calculations and comprehensive records.',
  },
}

export default function AssessmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}