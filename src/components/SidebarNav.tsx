// components/SidebarNav.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { LucideProps } from 'lucide-react'
import { 
  Home, MapPin, FileText, CreditCard, Settings, 
  TrendingUp, Users, Building, Wallet, Target 
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
type NavItem = {
  name: string
  href: string
  icon: React.ForwardRefExoticComponent<LucideProps & React.RefAttributes<SVGSVGElement>>
  current?: boolean
}


const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Properties', href: '/properties', icon: MapPin },
  { name: 'Assessments', href: '/assessments', icon: FileText },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Admin', href: '/admin', icon: Settings },
]

export default function SidebarNav() {
  const { theme } = useTheme()

  return (
    <motion.nav 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      {navigation.map((item, index) => (
        <motion.a
          key={item.name}
          href={item.href}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.02, 
            x: 4,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          whileTap={{ scale: 0.98 }}
          className={`
            group relative flex items-center gap-3 px-4 py-3 rounded-2xl
            transition-all duration-300 font-medium
            ${item.current 
              ? theme === 'light'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg shadow-blue-500/25'
              : theme === 'light'
                ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }
          `}
        >
          {/* Animated background for active state */}
          {item.current && (
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 -z-10"
              layoutId="activeNav"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          
          <item.icon size={20} className={`
            transition-colors duration-300
            ${item.current ? 'text-white' : theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
          `} />
          
          <span className="text-sm font-medium">{item.name}</span>

          {/* Hover effect */}
          {!item.current && (
            <motion.div
              className={`
                absolute inset-0 rounded-2xl -z-10
                ${theme === 'light' 
                  ? 'bg-gradient-to-r from-gray-50 to-gray-100' 
                  : 'bg-gradient-to-r from-gray-800 to-gray-900'
                }
              `}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.a>
      ))}
    </motion.nav>
  )
}