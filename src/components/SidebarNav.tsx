"use client"
import React from 'react'
import Link from 'next/link'
import { Home, MapPin, FileText, CreditCard, Settings } from 'lucide-react'

type NavItem = {
  name: string
  href: string
  icon: React.ComponentType<any>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/prototype', icon: Home },
  { name: 'Properties', href: '/prototype/properties', icon: MapPin },
  { name: 'Assessments', href: '/prototype/assessments', icon: FileText },
  { name: 'Payments', href: '/prototype/payments', icon: CreditCard },
  { name: 'Admin', href: '/prototype/admin', icon: Settings },
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
