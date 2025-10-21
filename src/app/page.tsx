// app/prototype/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, DollarSign, Users, Calendar, 
  ChevronRight, Receipt, Building, Wallet, Target,
  ArrowRight, MapPin, FileText, Plus
} from 'lucide-react'
import Header from '@/components/Header'
import SidebarNav from '@/components/SidebarNav'
import { useTheme } from '@/contexts/ThemeContext'

export default function PrototypePage() {
  const [properties, setProperties] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const { theme } = useTheme()

  useEffect(() => {
    // Enhanced mock data
    const mockProperties = [
      { id: 1, address: '123 Main St', owner: 'John Doe', ward: 'Ward 1', value: 250000 },
      { id: 2, address: '456 Oak Ave', owner: 'Sarah Wilson', ward: 'Ward 2', value: 180000 },
      { id: 3, address: '789 Pine Rd', owner: 'Mike Johnson', ward: 'Ward 1', value: 320000 }
    ]
    
    const mockAssessments = [
      { id: 1, financialYear: '2024', assessedValue: 250000, totalDue: 1250, status: 'Pending', property: '123 Main St' },
      { id: 2, financialYear: '2024', assessedValue: 180000, totalDue: 900, status: 'Paid', property: '456 Oak Ave' },
      { id: 3, financialYear: '2024', assessedValue: 320000, totalDue: 1600, status: 'Overdue', property: '789 Pine Rd' }
    ]
    
    const mockPayments = [
      { id: 1, method: 'Credit Card', paidAmount: 1250, paidOn: new Date(), txRef: 'TX-001', property: '123 Main St' },
      { id: 2, method: 'Bank Transfer', paidAmount: 900, paidOn: new Date(), txRef: 'TX-002', property: '456 Oak Ave' },
      { id: 3, method: 'Cash', paidAmount: 800, paidOn: new Date(), txRef: 'TX-003', property: '789 Pine Rd' }
    ]

    setProperties(mockProperties)
    setAssessments(mockAssessments)
    setPayments(mockPayments)
  }, [])

  const totalDue = assessments.reduce((s, a) => s + (Number(a.totalDue ?? 0)), 0)
  const revenue = payments.reduce((s, p) => s + (Number(p.paidAmount ?? 0)), 0)

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${revenue.toLocaleString()}`,
      change: '+12.5%', 
      icon: DollarSign, 
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Current fiscal year',
      trend: 'up'
    },
    { 
      label: 'Outstanding Due', 
      value: `$${totalDue.toLocaleString()}`,
      change: '-3.2%', 
      icon: Wallet, 
      gradient: 'from-amber-500 to-orange-600',
      description: 'Pending collections',
      trend: 'down'
    },
    { 
      label: 'Properties', 
      value: properties.length.toString(), 
      change: '+4.7%', 
      icon: Building, 
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Registered properties',
      trend: 'up'
    },
    { 
      label: 'Collection Rate', 
      value: '84%', 
      change: '+8.1%', 
      icon: Target, 
      gradient: 'from-purple-500 to-pink-600',
      description: 'Efficiency metric',
      trend: 'up'
    }
  ]

  const wards = [
    { name: 'Ward 1', amount: '$1,200.00', properties: 42, progress: 75, gradient: 'from-blue-500 to-cyan-600' },
    { name: 'Ward 2', amount: '$3,400.00', properties: 68, progress: 90, gradient: 'from-emerald-500 to-teal-600' },
    { name: 'Ward 3', amount: '$0.00', properties: 23, progress: 0, gradient: 'from-gray-400 to-gray-500' },
    { name: 'Ward 4', amount: '$2,150.00', properties: 51, progress: 60, gradient: 'from-purple-500 to-pink-600' }
  ]

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${theme === 'light' 
        ? 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20'
      }
    `}>
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-3 xl:col-span-2"
          >
            <nav className="sticky top-8">
              <SidebarNav />
            </nav>
          </motion.aside>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-9 xl:col-span-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Welcome Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h1 className={`
                    text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent
                    ${theme === 'light'
                      ? 'from-gray-900 to-gray-700'
                      : 'from-white to-gray-300'
                    }
                  `}>
                    Dashboard Overview
                  </h1>
                  <p className={`
                    mt-2 text-lg
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    Welcome back! Here's what's happening today.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold
                    transition-all duration-300 shadow-lg
                    bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                    text-white
                  `}
                >
                  <Plus size={20} />
                  New Assessment
                </motion.button>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                    className={`
                      relative rounded-3xl p-6 overflow-hidden
                      ${theme === 'light' 
                        ? 'bg-white shadow-lg shadow-gray-200/50' 
                        : 'bg-gray-800 shadow-lg shadow-black/20'
                      }
                      border border-transparent
                      hover:shadow-xl hover:shadow-blue-500/10
                      transition-all duration-300
                    `}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`
                            text-sm font-medium
                            ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                          `}>
                            {stat.label}
                          </p>
                          <p className={`
                            text-2xl font-bold mt-1
                            ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                          `}>
                            {stat.value}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <TrendingUp 
                              size={16} 
                              className={stat.trend === 'up' ? 'text-emerald-500' : 'text-amber-500'} 
                            />
                            <span className={`
                              text-sm font-medium
                              ${stat.trend === 'up' ? 'text-emerald-600' : 'text-amber-600'}
                            `}>
                              {stat.change}
                            </span>
                          </div>
                        </div>
                        <div className={`
                          p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} 
                          text-white shadow-lg
                        `}>
                          <stat.icon size={24} />
                        </div>
                      </div>
                      <p className={`
                        text-xs mt-3
                        ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                      `}>
                        {stat.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="xl:col-span-2 space-y-8">
                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`
                      rounded-3xl p-6
                      ${theme === 'light' 
                        ? 'bg-white shadow-lg shadow-gray-200/50' 
                        : 'bg-gray-800 shadow-lg shadow-black/20'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`
                        text-xl font-bold
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        Quick Actions
                      </h2>
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        bg-gradient-to-r from-blue-500 to-purple-600 text-white
                      `}>
                        <FileText size={20} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: FileText, label: 'Create Assessment', description: 'Generate new property assessment', gradient: 'from-blue-500 to-cyan-600' },
                        { icon: DollarSign, label: 'Process Payment', description: 'Accept tax payments', gradient: 'from-emerald-500 to-teal-600' },
                        { icon: Building, label: 'Add Property', description: 'Register new property', gradient: 'from-purple-500 to-pink-600' },
                        { icon: Users, label: 'Manage Taxpayers', description: 'Update taxpayer information', gradient: 'from-amber-500 to-orange-600' }
                      ].map((action, index) => (
                        <motion.button
                          key={action.label}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className={`
                            p-4 rounded-2xl text-left transition-all duration-300 group
                            ${theme === 'light'
                              ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200/50'
                              : 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-12 h-12 rounded-xl flex items-center justify-center
                              bg-gradient-to-r ${action.gradient} text-white
                              group-hover:shadow-lg transition-shadow duration-300
                            `}>
                              <action.icon size={24} />
                            </div>
                            <div>
                              <div className={`
                                font-semibold
                                ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                              `}>
                                {action.label}
                              </div>
                              <div className={`
                                text-sm mt-1
                                ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                              `}>
                                {action.description}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Assessments */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className={`
                        rounded-3xl p-6
                        ${theme === 'light' 
                          ? 'bg-white shadow-lg shadow-gray-200/50' 
                          : 'bg-gray-800 shadow-lg shadow-black/20'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`
                          text-lg font-bold
                          ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                        `}>
                          Recent Assessments
                        </h3>
                        <button className={`
                          flex items-center gap-1 font-medium text-sm
                          text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                          transition-colors duration-200
                        `}>
                          View All
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {assessments.map((assessment, index) => (
                          <motion.div
                            key={assessment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className={`
                              flex items-center justify-between p-4 rounded-2xl
                              transition-all duration-300 group cursor-pointer
                              ${theme === 'light'
                                ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200/50'
                                : 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50'
                              }
                            `}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`
                                w-12 h-12 rounded-xl flex items-center justify-center
                                ${
                                  assessment.status === 'Paid' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                                  assessment.status === 'Overdue' ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' :
                                  'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                }
                              `}>
                                <FileText size={20} />
                              </div>
                              <div>
                                <div className={`
                                  font-semibold
                                  ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                `}>
                                  {assessment.property}
                                </div>
                                <div className={`
                                  text-sm
                                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                                `}>
                                  ${assessment.assessedValue?.toLocaleString()} •{' '}
                                  <span className={
                                    assessment.status === 'Paid' ? 'text-emerald-600 dark:text-emerald-400' :
                                    assessment.status === 'Overdue' ? 'text-red-600 dark:text-red-400' :
                                    'text-amber-600 dark:text-amber-400'
                                  }>
                                    {assessment.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`
                                px-4 py-2 rounded-xl text-sm font-medium
                                bg-blue-500 hover:bg-blue-600 text-white
                                transition-colors duration-200
                              `}
                            >
                              View
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Recent Payments */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className={`
                        rounded-3xl p-6
                        ${theme === 'light' 
                          ? 'bg-white shadow-lg shadow-gray-200/50' 
                          : 'bg-gray-800 shadow-lg shadow-black/20'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`
                          text-lg font-bold
                          ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                        `}>
                          Recent Payments
                        </h3>
                        <button className={`
                          flex items-center gap-1 font-medium text-sm
                          text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300
                          transition-colors duration-200
                        `}>
                          View All
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {payments.map((payment, index) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className={`
                              flex items-center justify-between p-4 rounded-2xl
                              transition-all duration-300 group cursor-pointer
                              ${theme === 'light'
                                ? 'bg-gray-50 hover:bg-gray-100 border border-gray-200/50'
                                : 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50'
                              }
                            `}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`
                                w-12 h-12 rounded-xl flex items-center justify-center
                                bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400
                              `}>
                                <DollarSign size={20} />
                              </div>
                              <div>
                                <div className={`
                                  font-semibold
                                  ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                `}>
                                  {payment.property}
                                </div>
                                <div className={`
                                  text-sm flex items-center gap-2
                                  ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                                `}>
                                  <Calendar size={14} />
                                  {payment.paidOn.toLocaleDateString()} • {payment.txRef}
                                </div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`
                                px-4 py-2 rounded-xl text-sm font-medium
                                bg-emerald-500 hover:bg-emerald-600 text-white
                                transition-colors duration-200
                              `}
                            >
                              Receipt
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right Column - Outstanding by Ward */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className={`
                    rounded-3xl p-6
                    ${theme === 'light' 
                      ? 'bg-white shadow-lg shadow-gray-200/50' 
                      : 'bg-gray-800 shadow-lg shadow-black/20'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`
                      text-xl font-bold
                      ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                    `}>
                      Outstanding by Ward
                    </h2>
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center
                      bg-gradient-to-r from-purple-500 to-pink-600 text-white
                    `}>
                      <MapPin size={20} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {wards.map((ward, index) => (
                      <motion.div
                        key={ward.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          p-4 rounded-2xl text-white relative overflow-hidden
                          bg-gradient-to-r ${ward.gradient} 
                          shadow-lg hover:shadow-xl transition-all duration-300
                        `}
                      >
                        {/* Progress bar */}
                        <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
                          <motion.div
                            className="h-full bg-white/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${ward.progress}%` }}
                            transition={{ delay: 1 + index * 0.1, duration: 1 }}
                          />
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                          <div>
                            <div className="font-semibold text-white/90">{ward.name}</div>
                            <div className="text-2xl font-bold mt-1">{ward.amount}</div>
                            <div className="text-white/70 text-sm mt-1">
                              {ward.properties} properties • {ward.progress}% collected
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
                          >
                            <ArrowRight size={16} className="text-white" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className={`
                      mt-6 p-4 rounded-2xl text-white
                      bg-gradient-to-r from-gray-900 to-gray-800
                      shadow-lg
                    `}
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-300">Total Outstanding</div>
                      <div className="text-2xl font-bold mt-1">${totalDue.toLocaleString()}</div>
                      <div className="text-xs text-gray-400 mt-2">
                        Across all wards and properties
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}