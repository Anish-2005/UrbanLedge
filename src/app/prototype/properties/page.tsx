'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Building, Users, Calendar, MapPinned, SquareStack
} from 'lucide-react'
import Header from '@/components/Header'
import SidebarNav from '@/components/SidebarNav'
import { supabase } from '@/lib/supabaseClient'

export default function PropertiesPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    try {
      setLoading(true)
      setError(null)
      const { data: rows, error } = await supabase.from('property').select('*')
      if (error) throw error
      const mapped = (rows ?? []).map((r: any) => ({
        id: r.property_id ?? r.id,
        address: r.address,
        ward: r.ward,
        ptype: r.ptype,
        usage: r.usage,
        landArea: Number(r.land_area ?? r.landArea ?? 0),
        builtArea: Number(r.built_area ?? r.builtArea ?? 0),
        owner: r.owner_id ?? r.owner ?? null,
        status: 'Active',
        lastAssessment: r.created_at ?? r.createdAt ?? new Date().toISOString()
      }))
      setItems(mapped)
      setLoading(false)
    } catch (err) {
      console.error('fetch properties error:', err)
      const e: any = err
      const message = e?.message ?? e?.error ?? (typeof e === 'object' ? JSON.stringify(e) : String(e)) ?? 'Unknown error'
      setError(message)
      setItems([])
      setLoading(false)
    }
  }

  async function handleDelete(id: number | string) {
    if (!confirm('Are you sure you want to delete this property?')) return
    try {
      const { error } = await supabase.from('property').delete().eq('property_id', id)
      if (error) throw error
      setItems(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      // Normalize error message for different shapes (Error, Supabase error, plain object)
      console.error('delete property error:', err)
      const e: any = err
      const message = e?.message ?? e?.error ?? (typeof e === 'object' ? JSON.stringify(e) : String(e)) ?? 'Unknown error'
      setError(message)
    }
  }

  async function handleAdd() {
    try {
      setError(null)
      // Build a clean payload using FK ids (ward_id, ptype_id). Use owner_id=1 for prototype.
      const payload = { address: 'New Property Address', ward: 'Ward 1', ptype: 'Residential', land_area: 0, built_area: 0, usage: 'Single Family' }

      // Resolve ward name -> ward_id
      let wardId: number | null = null
      try {
        const { data: wards } = await supabase.from('ward').select('ward_id,name').eq('name', payload.ward).limit(1).maybeSingle()
        if (wards && (wards as any).ward_id) wardId = (wards as any).ward_id
        else {
          const { data: newWard } = await supabase.from('ward').insert([{ name: payload.ward, area_description: '' }]).select('ward_id').maybeSingle()
          wardId = newWard ? (newWard as any).ward_id : null
        }
      } catch (e) { console.warn('ward lookup/create failed', e) }

      // Resolve ptype name -> ptype_id
      let ptypeId: number | null = null
      try {
        const { data: ptypes } = await supabase.from('property_type').select('ptype_id,name').eq('name', payload.ptype).limit(1).maybeSingle()
        if (ptypes && (ptypes as any).ptype_id) ptypeId = (ptypes as any).ptype_id
        else {
          const { data: newPtype } = await supabase.from('property_type').insert([{ name: payload.ptype, description: '' }]).select('ptype_id').maybeSingle()
          ptypeId = newPtype ? (newPtype as any).ptype_id : null
        }
      } catch (e) { console.warn('ptype lookup/create failed', e) }

      const insertBody: any = {
        owner_id: 1,
        ward_id: wardId,
        ptype_id: ptypeId,
        address: payload.address,
        land_area: payload.land_area,
        built_area: payload.built_area,
        usage: payload.usage
      }

      const { data, error } = await supabase.from('property').insert([insertBody]).select().single()
      // Handle Supabase/PostgREST errors gracefully — don't throw raw objects
      if (error) {
        // Supabase error may be opaque/empty in some environments (CORS, network failure, etc.).
        // Collect deep diagnostics so the browser console shows useful info for triage.
        let details = 'unserializable error'
        try {
          details = JSON.stringify(error, Object.getOwnPropertyNames(error))
        } catch (jsonErr) {
          try { details = String(error) } catch { details = 'unknown error' }
        }

        const ctorName = error && (error as any).constructor ? (error as any).constructor.name : typeof error
        let protoInfo = null
        try { protoInfo = Object.getPrototypeOf(error) } catch {}
        let descriptors = null
        try { descriptors = Object.getOwnPropertyDescriptors(error || {}) } catch {}
        let symbols = null
        try { symbols = Object.getOwnPropertySymbols(error || {}) } catch {}

        console.error('supabase insert returned error (diagnostics):', {
          error,
          details,
          ctorName,
          protoInfo,
          descriptors,
          symbolKeys: (symbols || []).map(s => s.toString()),
          keys: Object.keys(error || {}),
          entries: Object.entries(error || {})
        })

        const fallbackMsg = 'Supabase insert failed — check browser Network tab, NEXT_PUBLIC keys, and RLS/policies. See console for diagnostics.'
        const msg = (error as any)?.message ?? (error as any)?.details ?? (details && details !== '{}' ? details : fallbackMsg)
        setError(msg)
        return
      }
      if (!data) {
        console.error('supabase insert returned no data and no error', { data, error, insertBody })
        setError('No data returned from insert')
        return
      }
      const created = data
      setItems(prev => [{ id: created.property_id ?? created.id, address: created.address, ward: created.ward, ptype: created.ptype, usage: created.usage, landArea: Number(created.land_area), builtArea: Number(created.built_area), owner: created.owner_id ?? created.owner, status: 'Active', lastAssessment: created.created_at ?? created.createdAt }, ...prev])
    } catch (err) {
      console.error('create property error:', err)
      const e: any = err
      const message = e?.message ?? e?.error ?? (typeof e === 'object' ? JSON.stringify(e) : String(e)) ?? 'Unknown error'
      setError(message)
    }
  }

  function handleEdit(property: any) {
    alert(`Edit property: ${property.address}`)
  }

  const stats = [
    { label: 'Total Properties', value: items.length.toString(), icon: Building, color: 'bg-blue-500' },
    { label: 'Active Properties', value: items.filter(p => p.status === 'Active').length.toString(), icon: MapPinned, color: 'bg-green-500' },
    { label: 'Total Wards', value: '4', icon: MapPinned, color: 'bg-purple-500' },
    { label: 'Avg. Land Area', value: '775m²', icon: SquareStack, color: 'bg-orange-500' },
  ]

  const PropertyCard = ({ property, onEdit, onDelete }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              property.status === 'Active' ? 'bg-green-500' :
              property.status === 'Pending' ? 'bg-yellow-500' :
              'bg-gray-400'
            }`} />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {property.ptype} • {property.usage}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {property.address}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-gray-400" />
              <span>{property.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinned size={14} className="text-gray-400" />
              <span>Ward {property.ward}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <div className="text-gray-500">Land Area</div>
              <div className="font-semibold text-gray-900">{property.landArea}m²</div>
            </div>
            <div>
              <div className="text-gray-500">Built Area</div>
              <div className="font-semibold text-gray-900">{property.builtArea}m²</div>
            </div>
            <div>
              <div className="text-gray-500">Last Assessed</div>
              <div className="font-semibold text-gray-900">
                {new Date(property.lastAssessment).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          property.status === 'Active' ? 'bg-green-100 text-green-700' :
          property.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {property.status}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit?.(property)}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
          >
            <Edit2 size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete?.(property.id)}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

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
              {/* Header Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
                  <p className="text-gray-600 mt-2">Manage all registered properties and their details</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Plus size={20} />
                  Add Property
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

              {/* Properties Grid */}
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-gray-200 rounded-full" />
                        <div className="h-4 bg-gray-200 rounded w-24" />
                      </div>
                      <div className="h-6 bg-gray-200 rounded mb-3" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
                      <div className="flex gap-6 mb-4">
                        <div className="h-4 bg-gray-200 rounded w-20" />
                        <div className="h-4 bg-gray-200 rounded w-20" />
                      </div>
                      <div className="flex justify-between pt-4 border-t border-gray-100">
                        <div className="h-6 bg-gray-200 rounded w-16" />
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
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
                  <Building size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-600 mb-6">Get started by adding your first property</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <Plus size={20} />
                    Add First Property
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}