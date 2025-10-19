'use client'

import React, { useState } from 'react'
import { ArrowRight, TrendingUp, DollarSign, FileText, Users, Calendar, ChevronRight, Home, Receipt, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PrototypePage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const stats = [
    { label: 'Total Collected', value: '$42,800', change: '+12.5%', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Pending Payments', value: '$8,240', change: '-3.2%', icon: FileText, color: 'bg-yellow-500' },
    { label: 'Properties', value: '1,284', change: '+4.7%', icon: Home, color: 'bg-blue-500' },
    { label: 'Completion Rate', value: '84%', change: '+8.1%', icon: TrendingUp, color: 'bg-purple-500' }
  ]

  const recentPayments = [
    { name: 'John Doe', amount: '$600.00', receipt: 'R-20251019120000-1', date: '2 hours ago', status: 'completed' },
    { name: 'Sarah Wilson', amount: '$450.00', receipt: 'R-20251019115000-2', date: '4 hours ago', status: 'completed' },
    { name: 'Mike Johnson', amount: '$780.00', receipt: 'R-20251019110000-3', date: '1 day ago', status: 'completed' }
  ]

  const wards = [
    { name: 'Ward 1', amount: '$1,200.00', properties: 42, color: 'from-blue-500 to-blue-600' },
    { name: 'Ward 2', amount: '$3,400.00', properties: 68, color: 'from-green-500 to-green-600' },
    { name: 'Ward 3', amount: '$0.00', properties: 23, color: 'from-gray-400 to-gray-500' },
    { name: 'Ward 4', amount: '$2,150.00', properties: 51, color: 'from-purple-500 to-purple-600' }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Property Tax Portal</h1>
            <p className="text-gray-600 mt-2">Manage property assessments and tax collections</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="bg-white rounded-lg shadow-sm px-4 py-2">
              <div className="text-sm text-gray-500">Welcome back,</div>
              <div className="font-semibold">Tax Administrator</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 inline-flex">
          {['dashboard', 'assessments', 'payments', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
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
                </div>
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText size={18} className="text-blue-600" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Receipt size={24} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Create Assessment</div>
                      <div className="text-sm text-gray-600 mt-1">Generate new property assessment</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
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

            {/* Recent Payments */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                  View All
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {recentPayments.map((payment, index) => (
                  <motion.div
                    key={payment.receipt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users size={18} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{payment.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <Receipt size={14} />
                          {payment.receipt}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{payment.amount}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} />
                        {payment.date}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Outstanding by Ward */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm p-6"
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
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-xl bg-gradient-to-r ${ward.color} text-white hover:shadow-lg transition-shadow duration-300`}
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
              transition={{ delay: 0.8 }}
              className="mt-6 p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white"
            >
              <div className="text-center">
                <div className="text-sm text-gray-300">Total Outstanding</div>
                <div className="text-2xl font-bold mt-1">$6,750.00</div>
                <div className="text-xs text-gray-400 mt-2">Across all wards</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}