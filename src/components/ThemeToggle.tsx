// components/ThemeToggle.tsx
'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`
        relative p-3 rounded-2xl border transition-all duration-300
        ${theme === 'light' 
          ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 text-amber-600' 
          : 'bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700 text-indigo-200'
        }
        shadow-lg hover:shadow-xl
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {theme === 'light' ? (
          <Sun size={20} className="text-amber-500" />
        ) : (
          <Moon size={20} className="text-indigo-200" />
        )}
      </motion.div>
      
      {/* Animated background orb */}
      <motion.div
        className={`
          absolute inset-0 rounded-2xl -z-10
          ${theme === 'light' 
            ? 'bg-gradient-to-br from-amber-400/10 to-orange-400/10' 
            : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10'
          }
        `}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.button>
  )
}