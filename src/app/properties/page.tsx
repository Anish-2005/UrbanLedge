'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Building, Users, Calendar, MapPinned, SquareStack,
  ChevronRight, TrendingUp, DollarSign, Target, FileText
} from 'lucide-react'
import Header from '@/components/Header'
import SidebarNav from '@/components/SidebarNav'
import { mockService } from '@/lib/mockService'
import { useTheme } from '@/contexts/ThemeContext'

export default function PropertiesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<any | null>(null)
  const { theme } = useTheme()

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    try {
      setLoading(true)
      setError(null)
      
      // Try API first
      try {
        const res = await fetch('/api/properties')
        if (res.ok) {
          const rows = await res.json()
          const mapped = (rows ?? []).map((r: any) => ({
            id: r.property_id ?? r.id,
            address: r.address,
            ward: r.ward,
            ptype: r.ptype,
            usage: r.usage,
            landArea: Number(r.land_area ?? r.landArea ?? 0),
            builtArea: Number(r.built_area ?? r.builtArea ?? 0),
            owner: r.owner_id ?? r.ownerId ?? null,
            status: 'Active',
            lastAssessment: new Date().toISOString()
          }))
          setItems(mapped)
          setLoading(false)
          return
        }
      } catch (apiError) {
        console.warn('API failed, falling back to mock service:', apiError)
      }
      
      // Fallback to mock service
      const mockProperties = mockService.properties.list()
      const mapped = mockProperties.map((r: any) => ({
        id: r.id,
        address: r.address,
        ward: r.ward,
        ptype: r.ptype,
        usage: r.usage,
        landArea: Number(r.landArea ?? 0),
        builtArea: Number(r.builtArea ?? 0),
        owner: r.ownerId ?? null,
        status: 'Active',
        lastAssessment: new Date().toISOString()
      }))
      setItems(mapped)
      setLoading(false)
    } catch (err) {
      console.error('fetch properties error:', err)
      const ee: any = err
      const message = ee?.message ?? ee?.error ?? (typeof ee === 'object' ? JSON.stringify(ee) : String(ee)) ?? 'Unknown error'
      setError(message)
      setItems([])
      setLoading(false)
    }
  }

  async function handleDelete(id: number | string) {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      // Try API first
      try {
        const res = await fetch(`/api/properties?id=${encodeURIComponent(String(id))}`, { method: 'DELETE' })
        if (res.ok) {
          setItems(prev => prev.filter(item => item.id !== id))
          return
        }
      } catch (apiError) {
        console.warn('API delete failed, using mock service:', apiError)
      }
      
      // Fallback to mock service
      mockService.properties.delete(String(id))
      setItems(prev => prev.filter(item => item.id !== id))
      console.log('Property deleted successfully with mock service:', id)
    } catch (err) {
      console.error('delete property error:', err)
      setError(String(err))
    }
  }

  async function handleAdd() {
    try {
      setError(null)
      const payload = { address: 'New Property Address', ward: 'Ward 1', ptype: 'Residential', land_area: 0, built_area: 0, usage: 'Single Family' }
      
      // Try API first
      try {
        const res = await fetch('/api/properties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) {
          const created = await res.json()
          const newItem = {
            id: created.property_id ?? created.id ?? 'p' + Date.now(),
            address: created.address,
            ward: created.ward,
            ptype: created.ptype,
            usage: created.usage,
            landArea: Number(created.land_area ?? created.landArea ?? 0),
            builtArea: Number(created.built_area ?? created.builtArea ?? 0),
            owner: created.owner_id ?? created.ownerId ?? null,
            status: 'Active',
            lastAssessment: new Date().toISOString()
          }
          setItems(prev => [newItem, ...prev])
          return
        }
      } catch (apiError) {
        console.warn('API create failed, using mock service:', apiError)
      }
      
      // Fallback to mock service
      const newProperty = {
        id: 'p' + Date.now(),
        ownerId: 'u2', // default owner
        address: payload.address,
        ward: payload.ward,
        ptype: payload.ptype,
        landArea: payload.land_area,
        builtArea: payload.built_area,
        usage: payload.usage
      }
      
      mockService.properties.create(newProperty)
      
      const newItem = {
        id: newProperty.id,
        address: newProperty.address,
        ward: newProperty.ward,
        ptype: newProperty.ptype,
        usage: newProperty.usage,
        landArea: newProperty.landArea,
        builtArea: newProperty.builtArea,
        owner: newProperty.ownerId,
        status: 'Active',
        lastAssessment: new Date().toISOString()
      }
      
      setItems(prev => [newItem, ...prev])
      console.log('Property created successfully with mock service:', newItem)
    } catch (err) {
      console.error('create property error:', err)
      setError(String(err))
    }
  }

  function handleEdit(property: any) {
    setEditing(property)
  }

  async function saveEdit(changes: any) {
    try {
      const merged = { ...editing, ...changes }
      const payload = {
        property_id: merged.id ?? merged.property_id,
        address: merged.address,
        ward: merged.ward,
        ptype: merged.ptype,
        usage: merged.usage,
        land_area: Number(merged.landArea ?? merged.land_area ?? 0),
        built_area: Number(merged.builtArea ?? merged.built_area ?? 0)
      }
      
      // Try API first
      try {
        const res = await fetch('/api/properties', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        if (res.ok) {
          const updated = await res.json()
          setItems(prev => prev.map(it => (it.id === (updated.property_id ?? updated.id) ? {
            id: updated.property_id ?? updated.id,
            address: updated.address,
            ward: updated.ward,
            ptype: updated.ptype,
            usage: updated.usage,
            landArea: Number(updated.land_area ?? updated.landArea ?? it.landArea),
            builtArea: Number(updated.built_area ?? updated.builtArea ?? it.builtArea),
            owner: updated.owner_id ?? updated.ownerId ?? it.owner,
            status: it.status,
            lastAssessment: it.lastAssessment
          } : it)))
          setEditing(null)
          return
        }
      } catch (apiError) {
        console.warn('API update failed, using mock service:', apiError)
      }
      
      // Fallback to mock service
      const updatedProperty = {
        id: merged.id,
        ownerId: merged.owner ?? 'u2',
        address: merged.address,
        ward: merged.ward,
        ptype: merged.ptype,
        landArea: Number(merged.landArea ?? merged.land_area ?? 0),
        builtArea: Number(merged.builtArea ?? merged.built_area ?? 0),
        usage: merged.usage
      }
      
      mockService.properties.update(updatedProperty)
      
      setItems(prev => prev.map(it => (it.id === merged.id ? {
        id: merged.id,
        address: merged.address,
        ward: merged.ward,
        ptype: merged.ptype,
        usage: merged.usage,
        landArea: updatedProperty.landArea,
        builtArea: updatedProperty.builtArea,
        owner: updatedProperty.ownerId,
        status: it.status,
        lastAssessment: it.lastAssessment
      } : it)))
      setEditing(null)
      console.log('Property updated successfully with mock service:', updatedProperty)
    } catch (err) {
      console.error('save edit error', err)
      setError(String(err))
    }
  }

  const stats = [
    { 
      label: 'Total Properties', 
      value: items.length.toString(),
      change: '+4.7%', 
      icon: Building, 
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Registered properties',
      trend: 'up'
    },
    { 
      label: 'Active Properties', 
      value: items.filter(p => p.status === 'Active').length.toString(),
      change: '+2.1%', 
      icon: MapPinned, 
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Currently active',
      trend: 'up'
    },
    { 
      label: 'Total Wards', 
      value: (() => {
        try {
          const s = new Set(items.map(it => String(it.ward ?? it.ward_id ?? '').trim()).filter(Boolean))
          return s.size.toString()
        } catch { return '0' }
      })(),
      change: '+0%', 
      icon: Target, 
      gradient: 'from-purple-500 to-pink-600',
      description: 'Coverage areas',
      trend: 'stable'
    },
    { 
      label: 'Avg. Land Area', 
      value: (() => {
        try {
          if (!items || items.length === 0) return '0m²'
          const sum = items.reduce((s, it) => s + (Number(it.landArea ?? it.land_area ?? 0) || 0), 0)
          const avg = Math.round(sum / items.length)
          return `${avg}m²`
        } catch { return '0m²' }
      })(),
      change: '+1.2%', 
      icon: SquareStack, 
      gradient: 'from-amber-500 to-orange-600',
      description: 'Average property size',
      trend: 'up'
    },
  ]

  const PropertyCard = ({ property, onEdit, onDelete }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-50" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${
                property.status === 'Active' ? 'bg-emerald-500' :
                property.status === 'Pending' ? 'bg-amber-500' :
                'bg-gray-400'
              }`} />
              <span className={`
                text-xs font-medium uppercase tracking-wide
                ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
              `}>
                {property.ptype} • {property.usage}
              </span>
            </div>

            <h3 className={`
              text-lg font-semibold mb-3
              ${theme === 'light' ? 'text-gray-900' : 'text-white'}
            `}>
              {property.address}
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Users size={14} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>{property.owner}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinned size={14} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>Ward {property.ward}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Land Area</div>
                <div className={theme === 'light' ? 'font-semibold text-gray-900' : 'font-semibold text-white'}>{property.landArea}m²</div>
              </div>
              <div>
                <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Built Area</div>
                <div className={theme === 'light' ? 'font-semibold text-gray-900' : 'font-semibold text-white'}>{property.builtArea}m²</div>
              </div>
              <div>
                <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Last Assessed</div>
                <div className={theme === 'light' ? 'font-semibold text-gray-900' : 'font-semibold text-white'}>
                  {new Date(property.lastAssessment).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            property.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
            property.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'
          }`}>
            {property.status}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit?.(property)}
              className={`
                p-2 rounded-xl font-medium transition-all duration-200
                bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm
              `}
            >
              <Edit2 size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete?.(property.id)}
              className={`
                p-2 rounded-xl font-medium transition-all duration-200
                bg-red-500 hover:bg-red-600 text-white shadow-sm
              `}
            >
              <Trash2 size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${theme === 'light'
        ? 'bg-gradient-to-br from-white via-sky-50 to-slate-50 text-slate-900'
        : 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 text-white'
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
                    Property Management
                  </h1>
                  <p className={`
                    mt-2 text-lg
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    Manage all registered properties and their details
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAdd}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold
                    transition-all duration-300 shadow-md
                    bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600
                    text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                  `}
                >
                  <Plus size={20} />
                  Add Property
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

              {/* Properties Grid */}
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`
                      rounded-3xl p-6 border border-transparent
                      ${theme === 'light'
                        ? 'bg-white shadow-lg ring-1 ring-inset ring-gray-100'
                        : 'bg-gray-800 shadow-lg shadow-black/20'
                      }
                      animate-pulse
                    `}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-3 h-3 rounded-full ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                        <div className={`h-4 rounded w-24 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                      </div>
                      <div className={`h-6 rounded mb-3 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                      <div className={`h-4 rounded w-3/4 mb-6 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                      <div className="flex gap-6 mb-4">
                        <div className={`h-4 rounded w-20 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                        <div className={`h-4 rounded w-20 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                      </div>
                      <div className="flex justify-between pt-4 border-t border-gray-200/50">
                        <div className={`h-6 rounded w-16 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                        <div className="flex gap-2">
                          <div className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                          <div className={`w-8 h-8 rounded-xl ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {items.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </motion.div>
              )}

              {/* Empty State */}
              {!loading && items.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Building size={64} className={`mx-auto mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
                  <h3 className={`
                    text-lg font-semibold mb-2
                    ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                  `}>
                    No properties found
                  </h3>
                  <p className={`
                    mb-6
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    Get started by adding your first property
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className={`
                      inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                      text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200
                    `}
                  >
                    <Plus size={20} />
                    Add First Property
                  </motion.button>
                </motion.div>
              )}

              {/* Edit Modal */}
              {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className={`
                    rounded-3xl p-6 w-full max-w-md
                    ${theme === 'light' 
                      ? 'bg-white shadow-xl' 
                      : 'bg-gray-800 shadow-xl shadow-black/30'
                    }
                  `}>
                    <h3 className={`
                      text-lg font-semibold mb-4
                      ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                    `}>
                      Edit Property
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Address
                        </label>
                        <input 
                          className={`
                            w-full border rounded-2xl p-3 mt-1
                            ${theme === 'light'
                              ? 'border-gray-200 bg-white text-gray-900'
                              : 'border-gray-600 bg-gray-700 text-white'
                            }
                          `}
                          value={editing.address} 
                          onChange={e => setEditing({ ...editing, address: e.target.value })} 
                        />
                      </div>
                      <div>
                        <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Ward
                        </label>
                        <input 
                          className={`
                            w-full border rounded-2xl p-3 mt-1
                            ${theme === 'light'
                              ? 'border-gray-200 bg-white text-gray-900'
                              : 'border-gray-600 bg-gray-700 text-white'
                            }
                          `}
                          value={editing.ward} 
                          onChange={e => setEditing({ ...editing, ward: e.target.value })} 
                        />
                      </div>
                      <div>
                        <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Type
                        </label>
                        <input 
                          className={`
                            w-full border rounded-2xl p-3 mt-1
                            ${theme === 'light'
                              ? 'border-gray-200 bg-white text-gray-900'
                              : 'border-gray-600 bg-gray-700 text-white'
                            }
                          `}
                          value={editing.ptype} 
                          onChange={e => setEditing({ ...editing, ptype: e.target.value })} 
                        />
                      </div>
                      <div>
                        <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Land Area (m²)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className={`
                            w-full border rounded-2xl p-3 mt-1
                            ${theme === 'light'
                              ? 'border-gray-200 bg-white text-gray-900'
                              : 'border-gray-600 bg-gray-700 text-white'
                            }
                          `}
                          value={editing.landArea ?? editing.land_area ?? ''}
                          onChange={e => setEditing({ ...editing, landArea: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Built Area (m²)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className={`
                            w-full border rounded-2xl p-3 mt-1
                            ${theme === 'light'
                              ? 'border-gray-200 bg-white text-gray-900'
                              : 'border-gray-600 bg-gray-700 text-white'
                            }
                          `}
                          value={editing.builtArea ?? editing.built_area ?? ''}
                          onChange={e => setEditing({ ...editing, builtArea: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Usage
                        </label>
                        <input 
                          className={`
                            w-full border rounded-2xl p-3 mt-1
                            ${theme === 'light'
                              ? 'border-gray-200 bg-white text-gray-900'
                              : 'border-gray-600 bg-gray-700 text-white'
                            }
                          `}
                          value={editing.usage} 
                          onChange={e => setEditing({ ...editing, usage: e.target.value })} 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-6">
                      <button 
                        className={`
                          px-4 py-2 rounded-xl font-medium transition-colors
                          ${theme === 'light'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }
                        `}
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
                        onClick={() => saveEdit({})}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}