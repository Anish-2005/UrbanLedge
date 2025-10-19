'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, MapPin, FileText, CreditCard, Settings, Search, 
  Plus, Edit2, Trash2, Building, Users, Calendar,
  ArrowRight, ChevronRight, DollarSign, Target,
  HomeIcon, MapPinned, SquareStack, Calculator,
  CheckCircle, Clock, AlertCircle, Download
} from 'lucide-react'
import Header from '@/components/Header'
import SidebarNav from '@/components/SidebarNav'
import { supabase } from '@/lib/supabaseClient'

export default function AssessmentsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)

  useEffect(() => { 
    fetchList() 
    // Mock properties for dropdown
    fetchProperties()
  }, [])

  const [properties, setProperties] = useState<any[]>([])

  async function fetchList() {
    try {
      setLoading(true)
      const { data: rows, error } = await supabase.from('assessment').select('*, property:property_id(address)')
      if (error) throw error
      const mapped = rows.map((r: any) => ({
        id: r.assess_id,
        financialYear: r.financial_year,
        assessedValue: Number(r.assessed_value),
        baseTax: Number(r.base_tax),
        exemptionPct: Number(r.exemption_pct || r.exemptionPct || 0),
        penalty: Number(r.penalty || 0),
        totalDue: Number(r.total_due),
        status: r.status,
        propertyId: r.property_id,
        propertyAddress: r.property?.address || r.address || '',
        createdAt: r.created_at
      }))
      setItems(mapped)
      setLoading(false)
    } catch (e) {
      setItems([])
      setLoading(false)
    }
  }
  async function fetchProperties() {
    try {
      const { data: rows, error } = await supabase.from('property').select('*')
      if (error) return
      setProperties((rows ?? []).map((r: any) => ({ id: r.property_id ?? r.id, address: r.address, ward: r.ward })))
    } catch (e) { /* ignore */ }
  }

  async function handleSave(assessment: any) {
    try {
      const payload = {
        property_id: assessment.propertyId,
        financial_year: assessment.financialYear,
        assessed_value: assessment.assessedValue,
        base_tax: assessment.baseTax,
        exemption_pct: assessment.exemptionPct,
        penalty: assessment.penalty,
        total_due: assessment.totalDue
      }
      const { data: created, error } = await supabase.from('assessment').insert([payload]).select().single()
      if (error) throw error
      setItems(prev => [{ id: created.assess_id, financialYear: created.financial_year, assessedValue: Number(created.assessed_value), baseTax: Number(created.base_tax), exemptionPct: Number(created.exemption_pct || 0), penalty: Number(created.penalty || 0), totalDue: Number(created.total_due), status: created.status, propertyId: created.property_id, propertyAddress: properties.find(p => p.id === created.property_id)?.address || '', createdAt: created.created_at }, ...prev])
    } catch (e) { 
      console.error(e) 
    }
  }

  async function handleMarkPaid(id: number) {
    try {
      // mark paid: create a payment and update assessment status locally
      const { data: updated, error } = await supabase.from('assessment').update({ status: 'PAID', total_due: 0 }).eq('assess_id', id).select().single()
      if (error) throw error
      setItems(prev => prev.map(item => item.id === updated.assess_id ? { ...item, status: updated.status, totalDue: Number(updated.total_due) } : item))
    } catch (e) { 
      console.error(e) 
    }
  }

  const AssessmentForm = ({ initial = {}, onSave }: any) => {
    const [financialYear, setFinancialYear] = useState(initial.financialYear || '2024-2025')
    const [propertyId, setPropertyId] = useState(initial.propertyId || '')
    const [assessedValue, setAssessedValue] = useState(initial.assessedValue || '')
    const [exemptionPct, setExemptionPct] = useState(initial.exemptionPct || '')
    const [penalty, setPenalty] = useState(initial.penalty || '')

    const baseTax = assessedValue ? Number(assessedValue) * 0.005 : 0
    const exemptionAmount = baseTax * (Number(exemptionPct) / 100)
    const totalDue = baseTax - exemptionAmount + (Number(penalty) || 0)

    function submit(e: React.FormEvent) {
      e.preventDefault()
      const assessment = {
        id: initial.id || 'a' + Date.now(),
        propertyId,
        financialYear,
        assessedValue: Number(assessedValue),
        baseTax,
        exemptionPct: Number(exemptionPct),
        penalty: Number(penalty) || 0,
        totalDue,
        status: 'DUE'
      }
      onSave(assessment)
      // Reset form
      if (!initial.id) {
        setFinancialYear('2024-2025')
        setPropertyId('')
        setAssessedValue('')
        setExemptionPct('')
        setPenalty('')
      }
    }

    return (
      <motion.form 
        onSubmit={submit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
          <select 
            value={propertyId} 
            onChange={e => setPropertyId(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value="">Select a property</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.address} (Ward {property.ward})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Financial Year</label>
          <select 
            value={financialYear} 
            onChange={e => setFinancialYear(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          >
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assessed Value ($)</label>
          <input 
            type="number" 
            value={assessedValue} 
            onChange={e => setAssessedValue(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter property value"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exemption (%)</label>
            <input 
              type="number" 
              value={exemptionPct} 
              onChange={e => setExemptionPct(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Penalty ($)</label>
            <input 
              type="number" 
              value={penalty} 
              onChange={e => setPenalty(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Calculation Preview */}
        {assessedValue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-50 rounded-xl p-4 space-y-2"
          >
            <div className="text-sm font-medium text-gray-700">Tax Calculation</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Base Tax (0.5%):</div>
              <div className="text-right font-medium">${baseTax.toFixed(2)}</div>
              
              <div className="text-gray-600">Exemption ({exemptionPct}%):</div>
              <div className="text-right text-green-600">-${exemptionAmount.toFixed(2)}</div>
              
              {penalty && (
                <>
                  <div className="text-gray-600">Penalty:</div>
                  <div className="text-right text-red-600">+${Number(penalty).toFixed(2)}</div>
                </>
              )}
              
              <div className="border-t pt-1 font-semibold text-gray-900">Total Due:</div>
              <div className="border-t pt-1 text-right font-bold text-indigo-600">${totalDue.toFixed(2)}</div>
            </div>
          </motion.div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-3 font-medium shadow-sm hover:shadow-md transition-all duration-200"
        >
          {initial.id ? 'Update Assessment' : 'Create Assessment'}
        </motion.button>
      </motion.form>
    )
  }

// navigation moved to shared SidebarNav component

  const stats = [
    { label: 'Total Assessments', value: items.length.toString(), icon: FileText, color: 'bg-blue-500' },
    { label: 'Pending Payment', value: items.filter(a => a.status === 'DUE').length.toString(), icon: Clock, color: 'bg-yellow-500' },
    { label: 'Overdue', value: items.filter(a => a.status === 'OVERDUE').length.toString(), icon: AlertCircle, color: 'bg-red-500' },
    { label: 'Total Revenue', value: '$' + items.reduce((sum, a) => sum + a.totalDue, 0).toFixed(2), icon: DollarSign, color: 'bg-green-500' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle size={16} className="text-green-600" />
      case 'OVERDUE': return <AlertCircle size={16} className="text-red-600" />
      default: return <Clock size={16} className="text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-700 border-green-200'
      case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

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
                  <h1 className="text-3xl font-bold text-gray-900">Tax Assessments</h1>
                  <p className="text-gray-600 mt-2">Create and manage property tax assessments</p>
                </div>
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assessment Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-1"
                >
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Calculator size={18} className="text-indigo-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">New Assessment</h2>
                    </div>
                    <AssessmentForm onSave={handleSave} />
                  </div>
                </motion.div>

                {/* Existing Assessments */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText size={18} className="text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Existing Assessments</h2>
                      </div>
                      <span className="text-sm text-gray-500">{items.length} total</span>
                    </div>

                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="p-4 border border-gray-200 rounded-xl animate-pulse">
                            <div className="flex justify-between items-start mb-3">
                              <div className="h-4 bg-gray-200 rounded w-32" />
                              <div className="h-6 bg-gray-200 rounded w-20" />
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-48 mb-2" />
                            <div className="h-3 bg-gray-200 rounded w-36" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((assessment, index) => (
                          <motion.div
                            key={assessment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="p-4 border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(assessment.status)}
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {assessment.financialYear} • ${assessment.assessedValue?.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {assessment.propertyAddress}
                                  </div>
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assessment.status)}`}>
                                {assessment.status}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                              <div>
                                <div className="text-gray-500">Base Tax</div>
                                <div className="font-medium">${assessment.baseTax}</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Exemption</div>
                                <div className="font-medium text-green-600">{assessment.exemptionPct}%</div>
                              </div>
                              <div>
                                <div className="text-gray-500">Total Due</div>
                                <div className="font-bold text-indigo-600">${assessment.totalDue}</div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="text-xs text-gray-500">
                                Created {new Date(assessment.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                {assessment.status !== 'PAID' && (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleMarkPaid(assessment.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                                  >
                                    Mark Paid
                                  </motion.button>
                                )}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  <Download size={14} />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {!loading && items.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
                        <p className="text-gray-600">Create your first assessment using the form</p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}