'use client'

import React from 'react'
import Link from 'next/link'
import { Home, MapPin, FileText, CreditCard, Settings } from 'lucide-react'

export default function Sidebar() {
  return (
    <nav className="sticky top-6">
      <div className="bg-white border rounded-lg p-4 space-y-2">
        <Link href="/prototype" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
          <Home size={16} />
          <span className="text-sm font-medium">Dashboard</span>
        </Link>

        <Link href="/prototype/properties" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
          <MapPin size={16} />
          <span className="text-sm font-medium">Properties</span>
        </Link>

        <Link href="/prototype/assessments" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
          <FileText size={16} />
          <span className="text-sm font-medium">Assessments</span>
        </Link>

        <Link href="/prototype/payments" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
          <CreditCard size={16} />
          <span className="text-sm font-medium">Payments</span>
        </Link>

        <Link href="/prototype/admin" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
          <Settings size={16} />
          <span className="text-sm font-medium">Admin</span>
        </Link>
      </div>
    </nav>
  )
}
