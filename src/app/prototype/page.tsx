'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, MapPin, FileText, CreditCard, Settings, Search, 
  ArrowRight, TrendingUp, DollarSign, Users, Calendar, 
  ChevronRight, Receipt, Building, Wallet, Target,
  LogIn,
  User
} from 'lucide-react'
import Header from '@/components/Header'
import SidebarNav from '@/components/SidebarNav'

export default function PrototypePage() {
  const [properties, setProperties] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // Mock data simulation
    const mockProperties = [
      { id: 1, address: '123 Main St', owner: 'John Doe', ward: 'Ward 1' },
      { id: 2, address: '456 Oak Ave', owner: 'Sarah Wilson', ward: 'Ward 2' },
      { id: 3, address: '789 Pine Rd', owner: 'Mike Johnson', ward: 'Ward 1' }
    ]
    
    const mockAssessments = [
      { id: 1, financialYear: '2024', assessedValue: 250000, totalDue: 1250, status: 'Pending' },
      { id: 2, financialYear: '2024', assessedValue: 180000, totalDue: 900, status: 'Paid' },
      { id: 3, financialYear: '2024', assessedValue: 320000, totalDue: 1600, status: 'Overdue' }
    ]
    
    const mockPayments = [
      { id: 1, method: 'Credit Card', paidAmount: 1250, paidOn: new Date(), txRef: 'TX-001' },
      { id: 2, method: 'Bank Transfer', paidAmount: 900, paidOn: new Date(), txRef: 'TX-002' },
      { id: 3, method: 'Cash', paidAmount: 800, paidOn: new Date(), txRef: 'TX-003' }
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
      value: '$' + revenue.toFixed(2), 
      change: '+12.5%', 
      icon: DollarSign, 
      color: 'bg-green-500',
      description: 'Current fiscal year'
    },
    { 
      label: 'Outstanding Due', 
      value: '$' + totalDue.toFixed(2), 
      change: '-3.2%', 
      icon: Wallet, 
      color: 'bg-yellow-500',
      description: 'Pending collections'
    },
    { 
      label: 'Properties', 
      value: properties.length.toString(), 
      change: '+4.7%', 
      icon: Building, 
      color: 'bg-blue-500',
      description: 'Registered properties'
    },
    { 
      label: 'Collection Rate', 
      value: '84%', 
      change: '+8.1%', 
      icon: Target, 
      color: 'bg-purple-500',
      description: 'Efficiency metric'
    }
  ]

  const wards = [
    { name: 'Ward 1', amount: '$1,200.00', properties: 42, color: 'from-blue-500 to-blue-600' },
    { name: 'Ward 2', amount: '$3,400.00', properties: 68, color: 'from-green-500 to-green-600' },
    { name: 'Ward 3', amount: '$0.00', properties: 23, color: 'from-gray-400 to-gray-500' },
    { name: 'Ward 4', amount: '$2,150.00', properties: 51, color: 'from-purple-500 to-purple-600' }
  ]


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-3 lg:col-span-2"
          >
            <nav className="sticky top-8">
              <SidebarNav />
            </nav>
          </motion.aside>

          {/* Main Content */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className={`text-sm mt-1 ${
                          stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl text-white shadow-sm`}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText size={18} className="text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <FileText size={24} className="text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">Create Assessment</div>
                            <div className="text-sm text-gray-600 mt-1">Generate new property assessment</div>
                          </div>
                        </div>
                      </motion.button>

                      <motion.button 
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <DollarSign size={24} className="text-green-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">Process Payment</div>
                            <div className="text-sm text-gray-600 mt-1">Accept tax payments</div>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Recent Assessments & Payments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Assessments */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Recent Assessments</h3>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                          View All
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {assessments.slice(0, 3).map((assessment, index) => (
                          <motion.div
                            key={assessment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                assessment.status === 'Paid' ? 'bg-green-100 text-green-600' :
                                assessment.status === 'Overdue' ? 'bg-red-100 text-red-600' :
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                <FileText size={18} />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {assessment.financialYear} — ${assessment.assessedValue?.toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-600">
                                  Due: ${assessment.totalDue} • <span className={
                                    assessment.status === 'Paid' ? 'text-green-600' :
                                    assessment.status === 'Overdue' ? 'text-red-600' :
                                    'text-yellow-600'
                                  }>{assessment.status}</span>
                                </div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
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
                      transition={{ delay: 0.6 }}
                      className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Recent Payments</h3>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                          View All
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {payments.slice(0, 3).map((payment, index) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign size={18} className="text-green-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {payment.method} — ${payment.paidAmount}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                  <Calendar size={14} />
                                  {payment.paidOn.toLocaleDateString()} • {payment.txRef}
                                </div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
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
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Outstanding by Ward</h2>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin size={18} className="text-purple-600" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {wards.map((ward, index) => (
                      <motion.div
                        key={ward.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`p-4 rounded-xl bg-gradient-to-r ${ward.color} text-white hover:shadow-lg transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white/90">{ward.name}</div>
                            <div className="text-2xl font-bold mt-1">{ward.amount}</div>
                            <div className="text-white/70 text-sm mt-1">{ward.properties} properties</div>
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
                    transition={{ delay: 1.0 }}
                    className="mt-6 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white"
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-300">Total Outstanding</div>
                      <div className="text-2xl font-bold mt-1">${totalDue.toFixed(2)}</div>
                      <div className="text-xs text-gray-400 mt-2">Across all wards and properties</div>
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