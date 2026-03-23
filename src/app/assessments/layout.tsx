import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/site'

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
    url: '/assessments',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Assessments - Property Tax Assessment Management',
    description: 'Property tax assessment management system with automated calculations and comprehensive records.',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: '/assessments',
  },
}

export default function AssessmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
