"use client"
import React from 'react'
import Link from 'next/link'

type NavItem = {
  name: string
  href: string
  icon: any
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/prototype', icon: (props: any) => React.createElement(require('lucide-react').Home, props) },
  { name: 'Properties', href: '/prototype/properties', icon: (props: any) => React.createElement(require('lucide-react').MapPin, props) },
  { name: 'Assessments', href: '/prototype/assessments', icon: (props: any) => React.createElement(require('lucide-react').FileText, props) },
  { name: 'Payments', href: '/prototype/payments', icon: (props: any) => React.createElement(require('lucide-react').CreditCard, props) },
  { name: 'Admin', href: '/prototype/admin', icon: (props: any) => React.createElement(require('lucide-react').Settings, props) },
]

export default function SidebarNav({ className = '' }: { className?: string }) {
  // render with client-side active detection
  const path = typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <nav className={`bg-white rounded-2xl shadow-sm p-4 space-y-2 border border-gray-100 ${className}`}>
      {navigation.map((item) => {
        const isCurrent = path === item.href
        const Icon = item.icon
        return (
          <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${isCurrent ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
            <Icon size={18} className={isCurrent ? 'text-indigo-600' : 'text-gray-400'} />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
