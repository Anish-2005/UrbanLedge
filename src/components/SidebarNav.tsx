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
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Properties', href: '/properties', icon: MapPin },
  { name: 'Assessments', href: '/assessments', icon: FileText },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Admin', href: '/admin', icon: Settings },
]

export default function SidebarNav({ className = '' }: { className?: string }) {
  // Avoid hydration mismatch: don't compute `isCurrent` during SSR.
  // Render non-active markup on first paint, then enable active detection after mount.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // safe path (only available after mount)
  const path = mounted && typeof window !== 'undefined' ? window.location.pathname : ''

  return (
    <nav className={`bg-white rounded-2xl shadow-sm p-4 space-y-2 border border-gray-100 ${className}`}>
      {navigation.map((item) => {
        const isCurrent = mounted && path === item.href
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
