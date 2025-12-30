import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Payments - Property Tax Payment Processing',
  description: 'Secure property tax payment processing system. Handle tax payments, track payment history, generate receipts, and manage payment methods with comprehensive transaction records.',
  keywords: [
    'property tax payments',
    'tax payment processing',
    'payment management',
    'tax collection',
    'payment receipts',
    'transaction processing',
    'municipal payments',
    'tax payment system'
  ],
  openGraph: {
    title: 'Payments - Property Tax Payment Processing',
    description: 'Secure property tax payment processing system with comprehensive transaction management.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payments - Property Tax Payment Processing',
    description: 'Secure property tax payment processing system with comprehensive transaction management.',
  },
}

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}