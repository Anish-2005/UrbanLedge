import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Demo - Property Tax Workflow Preview',
  description:
    'Interactive demo preview of UrbanLedge workflows for assessments, payments, and ward summaries.',
  openGraph: {
    title: 'UrbanLedge Demo',
    description:
      'Interactive demo preview of UrbanLedge municipal tax workflows.',
    type: 'website',
    url: '/demo',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrbanLedge Demo',
    description:
      'Interactive demo preview of UrbanLedge municipal tax workflows.',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: '/demo',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
