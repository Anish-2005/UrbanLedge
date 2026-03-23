'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import type { LucideProps } from 'lucide-react'
import { Home, MapPin, FileText, CreditCard, Settings } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

type NavItem = {
  name: string
  href: string
  icon: React.ForwardRefExoticComponent<LucideProps & React.RefAttributes<SVGSVGElement>>
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Properties', href: '/properties', icon: MapPin },
  { name: 'Assessments', href: '/assessments', icon: FileText },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Admin', href: '/admin', icon: Settings },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function SidebarNav() {
  const { theme } = useTheme()
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className={`hidden rounded-2xl border p-2 md:block ${
        theme === 'light'
          ? 'border-slate-200 bg-white shadow-sm'
          : 'border-slate-700 bg-slate-900/70 shadow-black/30'
      }`}
    >
      <div className="mb-2 px-3 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
        Navigation
      </div>

      <div className="space-y-1.5">
        {navigation.map((item, index) => {
          const active = isActive(pathname, item.href)

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : theme === 'light'
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <item.icon
                  size={18}
                  className={active ? 'text-white' : theme === 'light' ? 'text-slate-500' : 'text-slate-400'}
                />
                <span>{item.name}</span>
                {active && <span className="ml-auto h-2 w-2 rounded-full bg-white/90" />}
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.nav>
  )
}
