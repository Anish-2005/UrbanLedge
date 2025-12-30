import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel - Property Tax Management System',
  description: 'Administrative control panel for property tax management. Configure tax slabs, manage users, handle exemptions, oversee wards, and monitor system activities with comprehensive administrative tools.',
  keywords: [
    'admin panel',
    'property tax administration',
    'tax slab management',
    'user management',
    'exemption management',
    'ward management',
    'system administration',
    'municipal administration'
  ],
  openGraph: {
    title: 'Admin Panel - Property Tax Management',
    description: 'Administrative control panel for comprehensive property tax management and system configuration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admin Panel - Property Tax Management',
    description: 'Administrative control panel for comprehensive property tax management and system configuration.',
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}