'use client'

import React, { useState } from 'react'
import SidebarNav from '@/components/SidebarNav'
import { motion } from 'framer-motion'
import { 
  Home, MapPin, FileText, CreditCard, Settings, Search, 
  Plus, Edit2, Trash2, Building, Users, Calendar,
  ArrowRight, ChevronRight, DollarSign, Target,
  HomeIcon, MapPinned, SquareStack, Calculator,
  CheckCircle, Clock, AlertCircle, Download,
  CreditCardIcon, Banknote, QrCode, Receipt,
  TrendingUp, Wallet, Shield, Zap,
  Sliders, Percent, UserCog, BarChart3,
  ShieldCheck, Users as UsersIcon, PieChart,
  Building2, Landmark, FileBarChart
} from 'lucide-react'
import Header from '@/components/Header'

export default function AdminPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('tax-slabs')
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

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: false },
    { name: 'Properties', href: '#', icon: MapPin, current: false },
    { name: 'Assessments', href: '#', icon: FileText, current: false },
    { name: 'Payments', href: '#', icon: CreditCard, current: false },
    { name: 'Admin', href: '#', icon: Settings, current: true },
  ]

  const stats = [
    { label: 'Total Wards', value: '4', icon: MapPinned, color: 'bg-blue-500' },
    { label: 'Active Tax Slabs', value: '3', icon: FileBarChart, color: 'bg-green-500' },
    { label: 'Exemption Types', value: '3', icon: Percent, color: 'bg-purple-500' },
    { label: 'System Revenue', value: '$55.2K', icon: DollarSign, color: 'bg-orange-500' },
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
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${slab.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
          <div>
            <div className="font-semibold text-gray-900">{slab.type}</div>
            <div className="text-sm text-gray-600">
              Area: {slab.minArea}-{slab.maxArea} m²
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-indigo-600">${slab.rate}/m²</div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            slab.status === 'Active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {slab.status}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Tax Slab #{slab.id}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(slab)}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Edit2 size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(slab.id)}
            className={`p-2 rounded-lg transition-colors ${
              slab.status === 'Active'
                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {slab.status === 'Active' ? <Clock size={14} /> : <CheckCircle size={14} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  const ExemptionCard = ({ exemption, onEdit, onToggle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${exemption.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
          <div>
            <div className="font-semibold text-gray-900">{exemption.category}</div>
            <div className="text-sm text-gray-600">
              {exemption.minAge > 0 ? `Age ${exemption.minAge}+ • ` : ''}
              {exemption.percentage}% discount
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-600">{exemption.percentage}%</div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            exemption.status === 'Active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {exemption.status}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Exemption #{exemption.id}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(exemption)}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Edit2 size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(exemption.id)}
            className={`p-2 rounded-lg transition-colors ${
              exemption.status === 'Active'
                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {exemption.status === 'Active' ? <Clock size={14} /> : <CheckCircle size={14} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  const WardCard = ({ ward, onEdit, onToggle }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${ward.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
          <div>
            <div className="font-semibold text-gray-900">{ward.name}</div>
            <div className="text-sm text-gray-600">
              Officer: {ward.officer}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-indigo-600">${ward.revenue.toLocaleString()}</div>
          <div className={`text-xs px-2 py-1 rounded-full ${
            ward.status === 'Active' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {ward.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
        <div>
          <div className="text-gray-500">Properties</div>
          <div className="font-medium">{ward.properties}</div>
        </div>
        <div>
          <div className="text-gray-500">Revenue</div>
          <div className="font-medium">${ward.revenue.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Ward #{ward.id}
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(ward)}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            <Edit2 size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(ward.id)}
            className={`p-2 rounded-lg transition-colors ${
              ward.status === 'Active'
                ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {ward.status === 'Active' ? <Clock size={14} /> : <CheckCircle size={14} />}
          </motion.button>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-12 md:col-span-3 lg:col-span-2"
          >
            <nav className="sticky top-20">
              <SidebarNav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
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
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-gray-600 mt-2">Manage system settings, tax configurations, and user permissions</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <ShieldCheck size={20} />
                  System Settings
                </motion.button>
              </div>

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
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl text-white shadow-sm`}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Admin Tabs */}
              <div className="bg-white rounded-2xl shadow-sm p-2 border border-gray-100">
                <div className="flex space-x-1">
                  {adminTabs.map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
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
                      <h2 className="text-2xl font-bold text-gray-900">Tax Slabs Management</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
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
                      <h2 className="text-2xl font-bold text-gray-900">Exemptions & Concessions</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
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
                      <h2 className="text-2xl font-bold text-gray-900">Ward Management</h2>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
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
                    <UserCog size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">User Role Management</h3>
                    <p className="text-gray-600">Manage user permissions and access levels</p>
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div className="text-center py-12">
                    <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Reports & Analytics</h3>
                    <p className="text-gray-600">Generate system reports and view analytics</p>
                  </div>
                )}

                {activeTab === 'system' && (
                  <div className="text-center py-12">
                    <Sliders size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h3>
                    <p className="text-gray-600">Configure system-wide settings and preferences</p>
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