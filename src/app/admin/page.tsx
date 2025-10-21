'use client'

import React, { useState } from 'react'
import SidebarNav from '@/components/SidebarNav'
import { motion } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Building, Users, Calendar, MapPinned, SquareStack,
  ChevronRight, TrendingUp, DollarSign, Target, FileText, Calculator,
  CheckCircle, Clock, AlertCircle, Download, ArrowRight,
  CreditCardIcon, Banknote, QrCode, Receipt, Shield, Zap,
  Sliders, Percent, UserCog, BarChart3,
  ShieldCheck, Users as UsersIcon, PieChart,
  Building2, Landmark, FileBarChart
} from 'lucide-react'
import Header from '@/components/Header'
import { useTheme } from '@/contexts/ThemeContext'

export default function AdminPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('tax-slabs')
  const { theme } = useTheme()

  const [taxSlabs, setTaxSlabs] = useState([
    { id: 1, type: 'Residential', minArea: 0, maxArea: 150, rate: 10, status: 'Active' },
    { id: 2, type: 'Residential', minArea: 151, maxArea: 300, rate: 12, status: 'Active' },
    { id: 3, type: 'Commercial', minArea: 0, maxArea: 1000, rate: 15, status: 'Active' },
    { id: 4, type: 'Industrial', minArea: 0, maxArea: 5000, rate: 20, status: 'Inactive' }
  ])

  const [exemptions, setExemptions] = useState([
    { id: 1, category: 'Senior Citizen', percentage: 50, minAge: 65, status: 'Active' },
    { id: 2, category: 'Disabled Person', percentage: 60, minAge: 0, status: 'Active' },
    { id: 3, category: 'Low Income', percentage: 25, minAge: 0, status: 'Inactive' }
  ])

  const [wards, setWards] = useState([
    { id: 1, name: 'Ward 1', properties: 42, revenue: 12500, officer: 'John Smith', status: 'Active' },
    { id: 2, name: 'Ward 2', properties: 68, revenue: 18900, officer: 'Sarah Johnson', status: 'Active' },
    { id: 3, name: 'Ward 3', properties: 23, revenue: 8200, officer: 'Mike Brown', status: 'Active' },
    { id: 4, name: 'Ward 4', properties: 51, revenue: 15600, officer: 'Emily Davis', status: 'Inactive' }
  ])

  const stats = [
    { 
      label: 'Total Wards', 
      value: '4',
      change: '+0%', 
      icon: MapPinned, 
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Active wards',
      trend: 'stable'
    },
    { 
      label: 'Active Tax Slabs', 
      value: '3',
      change: '+1', 
      icon: FileBarChart, 
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Current tax rates',
      trend: 'up'
    },
    { 
      label: 'Exemption Types', 
      value: '3',
      change: '+0%', 
      icon: Percent, 
      gradient: 'from-purple-500 to-pink-600',
      description: 'Discount categories',
      trend: 'stable'
    },
    { 
      label: 'System Revenue', 
      value: '$55.2K',
      change: '+12.8%', 
      icon: DollarSign, 
      gradient: 'from-amber-500 to-orange-600',
      description: 'Current fiscal year',
      trend: 'up'
    },
  ]

  const adminTabs = [
    { id: 'tax-slabs', name: 'Tax Slabs', icon: FileBarChart },
    { id: 'exemptions', name: 'Exemptions', icon: Percent },
    { id: 'wards', name: 'Ward Management', icon: MapPinned },
    { id: 'users', name: 'User Roles', icon: UserCog },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'system', name: 'System Settings', icon: Sliders }
  ]

  const TaxSlabCard = ({ slab, onEdit, onToggle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`
        relative rounded-2xl p-4 overflow-hidden
        ${theme === 'light'
          ? 'bg-white shadow-sm ring-1 ring-inset ring-gray-100 hover:shadow-md'
          : 'bg-gray-700/50 ring-1 ring-inset ring-gray-600/50 hover:shadow-lg hover:shadow-black/30'
        }
        border border-transparent
        hover:shadow-indigo-500/5
        transition-all duration-300
      `}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 to-purple-500/3 opacity-50" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${slab.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <div>
              <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {slab.type}
              </div>
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Area: {slab.minArea}-{slab.maxArea} m²
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">${slab.rate}/m²</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              slab.status === 'Active' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
            }`}>
              {slab.status}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Tax Slab #{slab.id}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(slab)}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Edit2 size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(slab.id)}
              className={`p-2 rounded-xl transition-colors shadow-sm ${
                slab.status === 'Active'
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {slab.status === 'Active' ? <Clock size={14} /> : <CheckCircle size={14} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const ExemptionCard = ({ exemption, onEdit, onToggle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`
        relative rounded-2xl p-4 overflow-hidden
        ${theme === 'light'
          ? 'bg-white shadow-sm ring-1 ring-inset ring-gray-100 hover:shadow-md'
          : 'bg-gray-700/50 ring-1 ring-inset ring-gray-600/50 hover:shadow-lg hover:shadow-black/30'
        }
        border border-transparent
        hover:shadow-indigo-500/5
        transition-all duration-300
      `}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 to-purple-500/3 opacity-50" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${exemption.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <div>
              <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {exemption.category}
              </div>
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {exemption.minAge > 0 ? `Age ${exemption.minAge}+ • ` : ''}
                {exemption.percentage}% discount
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">{exemption.percentage}%</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              exemption.status === 'Active' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
            }`}>
              {exemption.status}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Exemption #{exemption.id}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(exemption)}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Edit2 size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(exemption.id)}
              className={`p-2 rounded-xl transition-colors shadow-sm ${
                exemption.status === 'Active'
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {exemption.status === 'Active' ? <Clock size={14} /> : <CheckCircle size={14} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const WardCard = ({ ward, onEdit, onToggle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`
        relative rounded-2xl p-4 overflow-hidden
        ${theme === 'light'
          ? 'bg-white shadow-sm ring-1 ring-inset ring-gray-100 hover:shadow-md'
          : 'bg-gray-700/50 ring-1 ring-inset ring-gray-600/50 hover:shadow-lg hover:shadow-black/30'
        }
        border border-transparent
        hover:shadow-indigo-500/5
        transition-all duration-300
      `}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 to-purple-500/3 opacity-50" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${ward.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <div>
              <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {ward.name}
              </div>
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Officer: {ward.officer}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">${ward.revenue.toLocaleString()}</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              ward.status === 'Active' 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
            }`}>
              {ward.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Properties</div>
            <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{ward.properties}</div>
          </div>
          <div>
            <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Revenue</div>
            <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>${ward.revenue.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Ward #{ward.id}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(ward)}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Edit2 size={14} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(ward.id)}
              className={`p-2 rounded-xl transition-colors shadow-sm ${
                ward.status === 'Active'
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {ward.status === 'Active' ? <Clock size={14} /> : <CheckCircle size={14} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const handleEditTaxSlab = (slab: any) => {
    alert(`Edit tax slab: ${slab.type} (${slab.minArea}-${slab.maxArea}m²)`)
  }

  const handleToggleTaxSlab = (id: number) => {
    setTaxSlabs(prev => prev.map(slab => 
      slab.id === id 
        ? { ...slab, status: slab.status === 'Active' ? 'Inactive' : 'Active' }
        : slab
    ))
  }

  const handleEditExemption = (exemption: any) => {
    alert(`Edit exemption: ${exemption.category} (${exemption.percentage}%)`)
  }

  const handleToggleExemption = (id: number) => {
    setExemptions(prev => prev.map(exemption => 
      exemption.id === id 
        ? { ...exemption, status: exemption.status === 'Active' ? 'Inactive' : 'Active' }
        : exemption
    ))
  }

  const handleEditWard = (ward: any) => {
    alert(`Edit ward: ${ward.name}`)
  }

  const handleToggleWard = (id: number) => {
    setWards(prev => prev.map(ward => 
      ward.id === id 
        ? { ...ward, status: ward.status === 'Active' ? 'Inactive' : 'Active' }
        : ward
    ))
  }

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${theme === 'light'
        ? 'bg-gradient-to-br from-white via-sky-50 to-slate-50 text-slate-900'
        : 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 text-white'
      }
    `}>
      <Header {...({ mobileOpen, setMobileOpen } as any)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 lg:col-span-3 xl:col-span-2"
          >
            <nav className="sticky top-20">
              <SidebarNav {...({ mobileOpen, setMobileOpen } as any)} />
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
              {/* Header Section */}
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
                      ? 'from-slate-900 to-slate-700'
                      : 'from-white to-gray-300'
                    }
                  `}>
                    Admin Panel
                  </h1>
                  <p className={`
                    mt-2 text-lg
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    Manage system settings, tax configurations, and user permissions
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold
                    transition-all duration-300 shadow-md
                    bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600
                    text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                  `}
                >
                  <ShieldCheck size={20} />
                  System Settings
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
                        ? 'bg-white shadow-lg shadow-gray-200/50 ring-1 ring-inset ring-gray-100' 
                        : 'bg-gray-800 shadow-lg shadow-black/20'
                      }
                      border border-transparent
                      hover:shadow-xl hover:shadow-blue-500/10
                      transition-all duration-300
                    `}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
                    
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
                              className={stat.trend === 'up' ? 'text-emerald-500' : stat.trend === 'down' ? 'text-amber-500' : 'text-gray-500'} 
                            />
                            <span className={`
                              text-sm font-medium
                              ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-amber-600' : 'text-gray-600'}
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

              {/* Admin Tabs */}
              <div className={`
                rounded-3xl p-2
                ${theme === 'light'
                  ? 'bg-white shadow-lg ring-1 ring-inset ring-gray-100'
                  : 'bg-gray-800 shadow-lg shadow-black/20'
                }
              `}>
                <div className="flex flex-wrap gap-1">
                  {adminTabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all duration-200
                        ${activeTab === tab.id
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                          : theme === 'light'
                            ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <tab.icon size={18} />
                      {tab.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {activeTab === 'tax-slabs' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`
                        text-2xl font-bold
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        Tax Slabs Management
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold
                          bg-gradient-to-r from-emerald-600 to-green-600 text-white
                          shadow-md hover:shadow-lg transition-all duration-200
                        `}
                      >
                        <Plus size={18} />
                        Add Tax Slab
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {taxSlabs.map((slab, index) => (
                        <TaxSlabCard
                          key={slab.id}
                          slab={slab}
                          onEdit={handleEditTaxSlab}
                          onToggle={handleToggleTaxSlab}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'exemptions' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`
                        text-2xl font-bold
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        Exemptions & Concessions
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold
                          bg-gradient-to-r from-emerald-600 to-green-600 text-white
                          shadow-md hover:shadow-lg transition-all duration-200
                        `}
                      >
                        <Plus size={18} />
                        Add Exemption
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {exemptions.map((exemption, index) => (
                        <ExemptionCard
                          key={exemption.id}
                          exemption={exemption}
                          onEdit={handleEditExemption}
                          onToggle={handleToggleExemption}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'wards' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`
                        text-2xl font-bold
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        Ward Management
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold
                          bg-gradient-to-r from-emerald-600 to-green-600 text-white
                          shadow-md hover:shadow-lg transition-all duration-200
                        `}
                      >
                        <Plus size={18} />
                        Add Ward
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wards.map((ward, index) => (
                        <WardCard
                          key={ward.id}
                          ward={ward}
                          onEdit={handleEditWard}
                          onToggle={handleToggleWard}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div className="text-center py-12">
                    <UserCog size={64} className={`mx-auto mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
                    <h3 className={`
                      text-xl font-semibold mb-2
                      ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                    `}>
                      User Role Management
                    </h3>
                    <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                      Manage user permissions and access levels
                    </p>
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div className="text-center py-12">
                    <BarChart3 size={64} className={`mx-auto mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
                    <h3 className={`
                      text-xl font-semibold mb-2
                      ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                    `}>
                      Reports & Analytics
                    </h3>
                    <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                      Generate system reports and view analytics
                    </p>
                  </div>
                )}

                {activeTab === 'system' && (
                  <div className="text-center py-12">
                    <Sliders size={64} className={`mx-auto mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
                    <h3 className={`
                      text-xl font-semibold mb-2
                      ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                    `}>
                      System Settings
                    </h3>
                    <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                      Configure system-wide settings and preferences
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}