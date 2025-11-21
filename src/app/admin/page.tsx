'use client'

import React, { useState, useEffect } from 'react'
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
  const { theme } = useTheme()

  // UI state used throughout the component
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('tax-slabs')

  // Data states
  const [taxSlabs, setTaxSlabs] = useState<any[]>([])
  const [exemptions, setExemptions] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [reports, setReports] = useState<any>({})

  // Loading states
  const [loadingTaxSlabs, setLoadingTaxSlabs] = useState(false)
  const [loadingExemptions, setLoadingExemptions] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [loadingReports, setLoadingReports] = useState(false)

  // Modal states
  const [editingTaxSlab, setEditingTaxSlab] = useState<any | null>(null)
  const [editingExemption, setEditingExemption] = useState<any | null>(null)
  const [editingWard, setEditingWard] = useState<any | null>(null)
  const [editingUser, setEditingUser] = useState<any | null>(null)

  useEffect(() => {
    if (activeTab === 'tax-slabs') fetchTaxSlabs()
    else if (activeTab === 'exemptions') fetchExemptions()
    else if (activeTab === 'wards') fetchWards()
    else if (activeTab === 'users') fetchUsers()
    else if (activeTab === 'reports') fetchReports()
  }, [activeTab])

  async function fetchTaxSlabs() {
    try {
      setLoadingTaxSlabs(true)
      const res = await fetch('/api/tax-slabs')
      if (res.ok) {
        const data = await res.json()
        setTaxSlabs(data)
      }
    } catch (err) {
      console.error('fetch tax slabs error:', err)
    } finally {
      setLoadingTaxSlabs(false)
    }
  }

  async function fetchExemptions() {
    try {
      setLoadingExemptions(true)
      const res = await fetch('/api/exemptions')
      if (res.ok) {
        const data = await res.json()
        setExemptions(data)
      }
    } catch (err) {
      console.error('fetch exemptions error:', err)
    } finally {
      setLoadingExemptions(false)
    }
  }

  async function fetchWards() {
    try {
      setLoadingWards(true)
      const res = await fetch('/api/wards')
      if (res.ok) {
        const data = await res.json()
        setWards(data)
      }
    } catch (err) {
      console.error('fetch wards error:', err)
    } finally {
      setLoadingWards(false)
    }
  }

  async function fetchUsers() {
    try {
      setLoadingUsers(true)
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error('fetch users error:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  async function fetchReports() {
    try {
      setLoadingReports(true)
      const res1 = await fetch('/api/reports?type=total_collected')
      const res2 = await fetch('/api/reports?type=pending_payments')
      const res3 = await fetch('/api/reports?type=property_stats')
      if (res1.ok && res2.ok && res3.ok) {
        const totalCollected = await res1.json()
        const pendingPayments = await res2.json()
        const propertyStats = await res3.json()
        setReports({ totalCollected, pendingPayments, propertyStats })
      }
    } catch (err) {
      console.error('fetch reports error:', err)
    } finally {
      setLoadingReports(false)
    }
  }

  const stats = [
    { 
      label: 'Total Wards', 
      value: wards.length.toString(),
      change: '+0%', 
      icon: MapPinned, 
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Active wards',
      trend: 'stable'
    },
    { 
      label: 'Active Tax Slabs', 
      value: taxSlabs.filter(s => s.active !== false).length.toString(),
      change: '+1', 
      icon: FileBarChart, 
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Current tax rates',
      trend: 'up'
    },
    { 
      label: 'Exemption Types', 
      value: exemptions.filter(e => e.active !== false).length.toString(),
      change: '+0%', 
      icon: Percent, 
      gradient: 'from-purple-500 to-pink-600',
      description: 'Discount categories',
      trend: 'stable'
    },
    { 
      label: 'System Revenue', 
      value: reports.totalCollected ? `$${reports.totalCollected[0]?.sum || 0}` : '$0',
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

  const TaxSlabCard = ({ slab, onEdit, onToggle, onDelete }: any) => (
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
            <div className={`w-3 h-3 rounded-full ${slab.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <div>
              <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {slab.property_type_name || `Type ${slab.ptype_id}`}
              </div>
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Area: {slab.min_area}-{slab.max_area} m²
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">${slab.base_rate_per_sq_m}/m²</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              slab.active 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
            }`}>
              {slab.active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Tax Slab #{slab.slab_id}
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
              onClick={() => onToggle(slab.slab_id)}
              className={`p-2 rounded-xl transition-colors shadow-sm ${
                slab.active
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {slab.active ? <Clock size={14} /> : <CheckCircle size={14} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(slab.slab_id)}
              className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const ExemptionCard = ({ exemption, onEdit, onToggle, onDelete }: any) => (
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
            <div className={`w-3 h-3 rounded-full ${exemption.active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <div>
              <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {exemption.exemption_name}
              </div>
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {exemption.description || 'No description'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-emerald-600">{exemption.exemption_percentage}%</div>
            <div className={`text-xs px-2 py-1 rounded-full ${
              exemption.active 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
            }`}>
              {exemption.active ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Exemption #{exemption.exemption_id}
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
              onClick={() => onToggle(exemption.exemption_id)}
              className={`p-2 rounded-xl transition-colors shadow-sm ${
                exemption.active
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {exemption.active ? <Clock size={14} /> : <CheckCircle size={14} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(exemption.exemption_id)}
              className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const WardCard = ({ ward, onEdit, onToggle, onDelete }: any) => (
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
            <div className={`w-3 h-3 rounded-full bg-emerald-500`} />
            <div>
              <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {ward.name}
              </div>
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {ward.area_description || 'No description'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-indigo-600">${ward.total_revenue?.toLocaleString() || '0'}</div>
            <div className={`text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400`}>
              Active
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Properties</div>
            <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{ward.property_count || 0}</div>
          </div>
          <div>
            <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Revenue</div>
            <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>${ward.total_revenue?.toLocaleString() || '0'}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
          <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            Ward #{ward.ward_id}
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
              onClick={() => onDelete(ward.ward_id)}
              className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  // Modal Components
  const TaxSlabModal = ({ slab, onSave, onClose }: any) => {
    const [formData, setFormData] = useState(slab)

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            w-full max-w-2xl rounded-3xl p-6
            ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
          `}
        >
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {slab.slab_id ? 'Edit Tax Slab' : 'Add Tax Slab'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Property Type ID
              </label>
              <input
                type="number"
                value={formData.ptype_id}
                onChange={(e) => setFormData({ ...formData, ptype_id: parseInt(e.target.value) })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Property Type Name
              </label>
              <input
                type="text"
                value={formData.property_type_name}
                onChange={(e) => setFormData({ ...formData, property_type_name: e.target.value })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                placeholder="e.g., Residential, Commercial"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Min Area (m²)
                </label>
                <input
                  type="number"
                  value={formData.min_area}
                  onChange={(e) => setFormData({ ...formData, min_area: parseFloat(e.target.value) })}
                  className={`
                    w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${theme === 'light'
                      ? 'border border-gray-300 bg-white text-gray-900'
                      : 'border border-gray-600 bg-gray-700 text-white'
                    }
                  `}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Max Area (m²)
                </label>
                <input
                  type="number"
                  value={formData.max_area}
                  onChange={(e) => setFormData({ ...formData, max_area: parseFloat(e.target.value) })}
                  className={`
                    w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${theme === 'light'
                      ? 'border border-gray-300 bg-white text-gray-900'
                      : 'border border-gray-600 bg-gray-700 text-white'
                    }
                  `}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Base Rate per m² ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.base_rate_per_sq_m}
                onChange={(e) => setFormData({ ...formData, base_rate_per_sq_m: parseFloat(e.target.value) })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSave(formData)}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl py-3 font-medium shadow-md hover:shadow-lg"
            >
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`flex-1 rounded-2xl py-3 font-medium ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const ExemptionModal = ({ exemption, onSave, onClose }: any) => {
    const [formData, setFormData] = useState(exemption)

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            w-full max-w-2xl rounded-3xl p-6
            ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
          `}
        >
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {exemption.exemption_id ? 'Edit Exemption' : 'Add Exemption'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Exemption Name
              </label>
              <input
                type="text"
                value={formData.exemption_name}
                onChange={(e) => setFormData({ ...formData, exemption_name: e.target.value })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                placeholder="e.g., Senior Citizen, Veterans"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Exemption Percentage (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.exemption_percentage}
                onChange={(e) => setFormData({ ...formData, exemption_percentage: parseFloat(e.target.value) })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                placeholder="Description of the exemption"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Active
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSave(formData)}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl py-3 font-medium shadow-md hover:shadow-lg"
            >
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`flex-1 rounded-2xl py-3 font-medium ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const WardModal = ({ ward, onSave, onClose }: any) => {
    const [formData, setFormData] = useState(ward)

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            w-full max-w-2xl rounded-3xl p-6
            ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
          `}
        >
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {ward.ward_id ? 'Edit Ward' : 'Add Ward'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Ward Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                placeholder="e.g., Ward 1, Downtown District"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Area Description
              </label>
              <textarea
                value={formData.area_description}
                onChange={(e) => setFormData({ ...formData, area_description: e.target.value })}
                rows={3}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                placeholder="Description of the ward area"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSave(formData)}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl py-3 font-medium shadow-md hover:shadow-lg"
            >
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`flex-1 rounded-2xl py-3 font-medium ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const UserModal = ({ user, onSave, onClose }: any) => {
    const [formData, setFormData] = useState(user)

    const toggleRole = (role: string) => {
      const roles = formData.roles || []
      if (roles.includes(role)) {
        setFormData({ ...formData, roles: roles.filter((r: string) => r !== role) })
      } else {
        setFormData({ ...formData, roles: [...roles, role] })
      }
    }

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            w-full max-w-2xl rounded-3xl p-6
            ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
          `}
        >
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {user.user_id ? 'Edit User' : 'Add User'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Roles
              </label>
              <div className="flex flex-wrap gap-2">
                {['ADMIN', 'OWNER', 'ASSESSOR', 'CASHIER'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`
                      px-4 py-2 rounded-xl font-medium transition-all
                      ${(formData.roles || []).includes(role)
                        ? 'bg-indigo-600 text-white'
                        : theme === 'light'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }
                    `}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className={`
                  w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${theme === 'light'
                    ? 'border border-gray-300 bg-white text-gray-900'
                    : 'border border-gray-600 bg-gray-700 text-white'
                  }
                `}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSave(formData)}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl py-3 font-medium shadow-md hover:shadow-lg"
            >
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className={`flex-1 rounded-2xl py-3 font-medium ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const handleEditTaxSlab = (slab: any) => {
    setEditingTaxSlab(slab)
  }

  const handleAddTaxSlab = () => {
    setEditingTaxSlab({
      slab_id: null,
      ptype_id: '',
      property_type_name: '',
      min_area: '',
      max_area: '',
      base_rate_per_sq_m: '',
      active: true
    })
  }

  const handleSaveTaxSlab = async (slab: any) => {
    try {
      const method = slab.slab_id ? 'PUT' : 'POST'
      const url = slab.slab_id ? `/api/tax-slabs` : '/api/tax-slabs'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slab)
      })
      
      if (response.ok) {
        setEditingTaxSlab(null)
        fetchTaxSlabs()
      } else {
        alert('Failed to save tax slab')
      }
    } catch (error) {
      console.error('Error saving tax slab:', error)
      alert('Error saving tax slab')
    }
  }

  const handleToggleTaxSlab = async (id: number) => {
    try {
      const response = await fetch(`/api/tax-slabs/${id}/toggle`, { method: 'PUT' })
      if (response.ok) {
        fetchTaxSlabs()
      } else {
        console.error('Failed to toggle tax slab')
      }
    } catch (error) {
      console.error('Error toggling tax slab:', error)
    }
  }

  const handleDeleteTaxSlab = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tax slab?')) return
    
    try {
      const response = await fetch(`/api/tax-slabs`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slab_id: id })
      })
      
      if (response.ok) {
        fetchTaxSlabs()
      } else {
        alert('Failed to delete tax slab')
      }
    } catch (error) {
      console.error('Error deleting tax slab:', error)
      alert('Error deleting tax slab')
    }
  }

  const handleEditExemption = (exemption: any) => {
    setEditingExemption(exemption)
  }

  const handleAddExemption = () => {
    setEditingExemption({
      exemption_id: null,
      exemption_name: '',
      exemption_percentage: '',
      description: '',
      active: true
    })
  }

  const handleSaveExemption = async (exemption: any) => {
    try {
      const method = exemption.exemption_id ? 'PUT' : 'POST'
      const url = '/api/exemptions'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exemption)
      })
      
      if (response.ok) {
        setEditingExemption(null)
        fetchExemptions()
      } else {
        alert('Failed to save exemption')
      }
    } catch (error) {
      console.error('Error saving exemption:', error)
      alert('Error saving exemption')
    }
  }

  const handleToggleExemption = async (id: number) => {
    try {
      const response = await fetch(`/api/exemptions/${id}/toggle`, { method: 'PUT' })
      if (response.ok) {
        fetchExemptions()
      } else {
        console.error('Failed to toggle exemption')
      }
    } catch (error) {
      console.error('Error toggling exemption:', error)
    }
  }

  const handleDeleteExemption = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exemption?')) return
    
    try {
      const response = await fetch(`/api/exemptions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exemption_id: id })
      })
      
      if (response.ok) {
        fetchExemptions()
      } else {
        alert('Failed to delete exemption')
      }
    } catch (error) {
      console.error('Error deleting exemption:', error)
      alert('Error deleting exemption')
    }
  }

  const handleEditWard = (ward: any) => {
    setEditingWard(ward)
  }

  const handleAddWard = () => {
    setEditingWard({
      ward_id: null,
      name: '',
      area_description: ''
    })
  }

  const handleSaveWard = async (ward: any) => {
    try {
      const method = ward.ward_id ? 'PUT' : 'POST'
      const url = '/api/wards'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ward)
      })
      
      if (response.ok) {
        setEditingWard(null)
        fetchWards()
      } else {
        alert('Failed to save ward')
      }
    } catch (error) {
      console.error('Error saving ward:', error)
      alert('Error saving ward')
    }
  }

  const handleDeleteWard = async (id: number) => {
    if (!confirm('Are you sure you want to delete this ward?')) return
    
    try {
      const response = await fetch(`/api/wards`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ward_id: id })
      })
      
      if (response.ok) {
        fetchWards()
      } else {
        alert('Failed to delete ward')
      }
    } catch (error) {
      console.error('Error deleting ward:', error)
      alert('Error deleting ward')
    }
  }

  const handleToggleWard = (id: number) => {
    alert(`Ward management: ${id}`)
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
  }

  const handleAddUser = () => {
    setEditingUser({
      user_id: null,
      username: '',
      full_name: '',
      email: '',
      roles: [],
      status: 'ACTIVE'
    })
  }

  const handleSaveUser = async (user: any) => {
    try {
      const method = user.user_id ? 'PUT' : 'POST'
      const url = '/api/users'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      })
      
      if (response.ok) {
        setEditingUser(null)
        fetchUsers()
      } else {
        alert('Failed to save user')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Error saving user')
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      const response = await fetch(`/api/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: id })
      })
      
      if (response.ok) {
        fetchUsers()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user')
    }
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
                        onClick={handleAddTaxSlab}
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
                          key={slab.slab_id}
                          slab={slab}
                          onEdit={handleEditTaxSlab}
                          onToggle={handleToggleTaxSlab}
                          onDelete={handleDeleteTaxSlab}
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
                        onClick={handleAddExemption}
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
                          key={exemption.exemption_id}
                          exemption={exemption}
                          onEdit={handleEditExemption}
                          onToggle={handleToggleExemption}
                          onDelete={handleDeleteExemption}
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
                        onClick={handleAddWard}
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
                          key={ward.ward_id}
                          ward={ward}
                          onEdit={handleEditWard}
                          onToggle={handleToggleWard}
                          onDelete={handleDeleteWard}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`
                        text-2xl font-bold
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        User Management
                      </h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddUser}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold
                          bg-gradient-to-r from-emerald-600 to-green-600 text-white
                          shadow-md hover:shadow-lg transition-all duration-200
                        `}
                      >
                        <Plus size={18} />
                        Add User
                      </motion.button>
                    </div>
                    {loadingUsers ? (
                      <div className="text-center py-8">Loading users...</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {users.map((user) => (
                          <div key={user.user_id} className={`
                            rounded-2xl p-4
                            ${theme === 'light'
                              ? 'bg-white shadow-sm ring-1 ring-inset ring-gray-100'
                              : 'bg-gray-700/50 ring-1 ring-inset ring-gray-600/50'
                            }
                          `}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                                  {user.full_name?.[0] || user.username[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    {user.full_name || user.username}
                                  </div>
                                  <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {user.username} • {user.roles?.join(', ') || 'No roles'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEditUser(user)}
                                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                  <Edit2 size={14} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDeleteUser(user.user_id)}
                                  className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-sm"
                                >
                                  <Trash2 size={14} />
                                </motion.button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email} • {user.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

      {/* Modals */}
      {editingTaxSlab && (
        <TaxSlabModal
          slab={editingTaxSlab}
          onSave={handleSaveTaxSlab}
          onClose={() => setEditingTaxSlab(null)}
        />
      )}
      {editingExemption && (
        <ExemptionModal
          exemption={editingExemption}
          onSave={handleSaveExemption}
          onClose={() => setEditingExemption(null)}
        />
      )}
      {editingWard && (
        <WardModal
          ward={editingWard}
          onSave={handleSaveWard}
          onClose={() => setEditingWard(null)}
        />
      )}
      {editingUser && (
        <UserModal
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  )
}