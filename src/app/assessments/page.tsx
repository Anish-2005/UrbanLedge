'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Building, Users, Calendar, MapPinned, SquareStack,
  ChevronRight, TrendingUp, DollarSign, Target, FileText, Calculator,
  CheckCircle, Clock, AlertCircle, Download, ArrowRight
} from 'lucide-react'
import Header from '@/components/Header'
import SidebarNav from '@/components/SidebarNav'
import { useTheme } from '@/contexts/ThemeContext'
import { useUI } from '@/contexts/UIContext'

export default function AssessmentsPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [properties, setProperties] = useState<any[]>([])
  const { theme } = useTheme()
  const { sidebarCollapsed } = useUI()

  useEffect(() => { 
    // load properties first so we can map property addresses when loading assessments
    async function init() {
      await fetchProperties()
    }
    init()
  }, [])

  // Reload assessments when properties change
  useEffect(() => {
    if (properties.length > 0) {
      fetchList()
    }
  }, [properties])

  async function fetchList() {
    try {
      setLoading(true)
      
      const res = await fetch('/api/assessments')
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }
      
      const rows = await res.json()
      // Map assessments and add property addresses
      const mapped = rows.map((r: any) => {
        const property = properties.find((p: any) => String(p.property_id) === String(r.property_id))
        return {
          id: r.assess_id || r.id,
          financialYear: r.financial_year,
          assessedValue: Number(r.assessed_value),
          baseTax: Number(r.base_tax),
          exemptionPct: Number(r.exemption_pct || 0),
          penalty: Number(r.penalty || 0),
          totalDue: Number(r.total_due),
          status: r.status,
          propertyId: r.property_id,
          propertyAddress: property?.address || 'Unknown Property',
          createdAt: r.created_at || new Date().toISOString()
        }
      })
      setItems(mapped)
      setLoading(false)
    } catch (e) {
      console.error('Failed to fetch assessments:', e)
      setItems([])
      setLoading(false)
    }
  }

  async function fetchProperties() {
    try {
      const res = await fetch('/api/properties')
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }
      
      const rows = await res.json()
      const mapped = (rows ?? []).map((r: any) => ({
        id: String(r.property_id ?? r.id ?? r.propertyId),
        address: r.address || r.addr || r.property_address || '',
        ward: r.ward || r.ward_name || r.ward_id || ''
      }))
      setProperties(mapped)
    } catch (e) {
      console.error('Failed to fetch properties:', e)
      setProperties([])
    }
  }

  async function handleSave(assessment: any) {
    try {
      // Find the property to get its address
      const property = properties.find(p => p.id === assessment.propertyId)
      
      const payload = { 
        property_id: String(assessment.propertyId), 
        financial_year: assessment.financialYear, 
        assessed_value: Number(assessment.assessedValue), 
        base_tax: Number(assessment.baseTax), 
        exemption_pct: Number(assessment.exemptionPct || 0), 
        penalty: Number(assessment.penalty || 0), 
        total_due: Number(assessment.totalDue), 
        status: 'DUE'
      }
      
      const res = await fetch('/api/assessments', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      })
      
      if (!res.ok) {
        throw new Error(`Create failed: ${res.status} ${res.statusText}`)
      }
      
      const created = await res.json()
      
      // Add to state with property address
      const newAssessment = { 
        id: created.assess_id || created.id, 
        financialYear: created.financial_year, 
        assessedValue: Number(created.assessed_value), 
        baseTax: Number(created.base_tax), 
        exemptionPct: Number(created.exemption_pct || 0), 
        penalty: Number(created.penalty || 0), 
        totalDue: Number(created.total_due), 
        status: created.status, 
        propertyId: created.property_id, 
        propertyAddress: property?.address || 'Unknown Address', 
        createdAt: created.created_at || new Date().toISOString() 
      }
      
      setItems(prev => [newAssessment, ...prev])
      
      console.log('Assessment created successfully:', newAssessment)
    } catch (e) { 
      console.error('Failed to create assessment:', e) 
    }
  }

  async function handleMarkPaid(id: number) {
    try {
      const res = await fetch('/api/assessments/markpaid', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ assess_id: id }) 
      })
      
      if (!res.ok) {
        throw new Error(`Mark paid failed: ${res.status} ${res.statusText}`)
      }
      
      // Update the local state
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'PAID', totalDue: 0 } : item
      ))
      
      console.log('Assessment marked as paid:', id)
    } catch (e) { 
      console.error('Failed to mark assessment as paid:', e) 
    }
  }

  // Download a single assessment as CSV
  async function downloadAssessment(assessment: any) {
    try {
      const headers = ['id','propertyId','propertyAddress','financialYear','assessedValue','baseTax','exemptionPct','penalty','totalDue','status','createdAt']
      const values = [
        assessment.id,
        assessment.propertyId,
        assessment.propertyAddress,
        assessment.financialYear,
        assessment.assessedValue,
        assessment.baseTax,
        assessment.exemptionPct,
        assessment.penalty,
        assessment.totalDue,
        assessment.status,
        assessment.createdAt,
      ]

      const escapeCsv = (v: any) => {
        if (v === null || v === undefined) return ''
        if (typeof v === 'number') return String(v)
        return '"' + String(v).replace(/"/g, '""') + '"'
      }

      const csvRows = [headers.join(','), values.map(escapeCsv).join(',')]
      const csv = csvRows.join('\r\n')

      // Add BOM so Excel recognizes UTF-8
      const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `assessment-${assessment.id}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed', err)
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
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Property
          </label>
          <select 
            value={propertyId} 
            onChange={e => setPropertyId(e.target.value)}
            className={`
              w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200
              ${theme === 'light'
                ? 'border border-gray-300 bg-white text-gray-900'
                : 'border border-gray-600 bg-gray-700 text-white'
              }
            `}
            required
            >
              <option value="">Select a property</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.address} {property.ward ? `(Ward ${property.ward})` : ''}
                </option>
              ))}
            </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Financial Year
          </label>
          <select 
            value={financialYear} 
            onChange={e => setFinancialYear(e.target.value)}
            className={`
              w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200
              ${theme === 'light'
                ? 'border border-gray-300 bg-white text-gray-900'
                : 'border border-gray-600 bg-gray-700 text-white'
              }
            `}
          >
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Assessed Value ($)
          </label>
          <input 
            type="number" 
            value={assessedValue} 
            onChange={e => setAssessedValue(e.target.value)}
            className={`
              w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200
              ${theme === 'light'
                ? 'border border-gray-300 bg-white text-gray-900'
                : 'border border-gray-600 bg-gray-700 text-white'
              }
            `}
            placeholder="Enter property value"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Exemption (%)
            </label>
            <input 
              type="number" 
              value={exemptionPct} 
              onChange={e => setExemptionPct(e.target.value)}
              className={`
                w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                ${theme === 'light'
                  ? 'border border-gray-300 bg-white text-gray-900'
                  : 'border border-gray-600 bg-gray-700 text-white'
                }
              `}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Penalty ($)
            </label>
            <input 
              type="number" 
              value={penalty} 
              onChange={e => setPenalty(e.target.value)}
              className={`
                w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200
                ${theme === 'light'
                  ? 'border border-gray-300 bg-white text-gray-900'
                  : 'border border-gray-600 bg-gray-700 text-white'
                }
              `}
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
            className={`
              rounded-2xl p-4 space-y-2
              ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}
            `}
          >
            <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Tax Calculation
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Base Tax (0.5%):</div>
              <div className={`text-right font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                ${baseTax.toFixed(2)}
              </div>
              
              <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Exemption ({exemptionPct}%):</div>
              <div className="text-right text-green-600">-${exemptionAmount.toFixed(2)}</div>
              
              {penalty && (
                <>
                  <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Penalty:</div>
                  <div className="text-right text-red-600">+${Number(penalty).toFixed(2)}</div>
                </>
              )}
              
              <div className={`border-t pt-1 font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Total Due:
              </div>
              <div className="border-t pt-1 text-right font-bold text-indigo-600">${totalDue.toFixed(2)}</div>
            </div>
          </motion.div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl py-3 font-medium 
            shadow-md hover:shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-indigo-600
          `}
        >
          {initial.id ? 'Update Assessment' : 'Create Assessment'}
        </motion.button>
      </motion.form>
    )
  }

  const stats = [
    { 
      label: 'Total Assessments', 
      value: items.length.toString(), 
      change: '+12.3%', 
      icon: FileText, 
      gradient: 'from-blue-500 to-indigo-600',
      description: 'All time assessments',
      trend: 'up'
    },
    { 
      label: 'Pending Payment', 
      value: items.filter(a => a.status === 'DUE').length.toString(),
      change: '-2.1%', 
      icon: Clock, 
      gradient: 'from-amber-500 to-orange-600',
      description: 'Awaiting payment',
      trend: 'down'
    },
    { 
      label: 'Overdue', 
      value: items.filter(a => a.status === 'OVERDUE').length.toString(),
      change: '+5.7%', 
      icon: AlertCircle, 
      gradient: 'from-red-500 to-pink-600',
      description: 'Past due assessments',
      trend: 'up'
    },
    { 
      label: 'Total Revenue', 
      value: '$' + items.reduce((sum, a) => sum + a.totalDue, 0).toFixed(2),
      change: '+18.4%', 
      icon: DollarSign, 
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Current fiscal year',
      trend: 'up'
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle size={16} className="text-emerald-500" />
      case 'OVERDUE': return <AlertCircle size={16} className="text-red-500" />
      default: return <Clock size={16} className="text-amber-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
      case 'OVERDUE': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'
      default: return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
    }
  }

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${theme === 'light'
        ? 'app-shell-bg text-slate-900'
        : 'app-shell-bg text-slate-100'
      }
    `}>
      <Header />

      <div className="w-full px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`hidden shrink-0 transition-[width] duration-300 lg:block ${sidebarCollapsed ? 'lg:w-14' : 'lg:w-72'}`}
          >
            <nav className="sticky top-20">
              <SidebarNav />
            </nav>
          </motion.aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
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
                    text-3xl font-semibold tracking-tight
                    ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}
                  `}>
                    Tax Assessments
                  </h1>
                  <p className={`
                    mt-2 text-lg
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    Create and manage property tax assessments
                  </p>
                </div>
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Assessment Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="lg:col-span-1"
                >
                  <div className={`
                    rounded-3xl p-6 sticky top-8
                    ${theme === 'light'
                      ? 'bg-white shadow-lg ring-1 ring-inset ring-gray-100'
                      : 'bg-gray-800 shadow-lg shadow-black/20'
                    }
                  `}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center
                        bg-gradient-to-r from-blue-600 to-slate-700 text-white shadow-lg
                      `}>
                        <Calculator size={20} />
                      </div>
                      <h2 className={`
                        text-xl font-bold
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        New Assessment
                      </h2>
                    </div>
                    <AssessmentForm onSave={handleSave} />
                  </div>
                </motion.div>

                {/* Existing Assessments */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="lg:col-span-2"
                >
                  <div className={`
                    rounded-3xl p-6
                    ${theme === 'light'
                      ? 'bg-white shadow-lg ring-1 ring-inset ring-gray-100'
                      : 'bg-gray-800 shadow-lg shadow-black/20'
                    }
                  `}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center
                          bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg
                        `}>
                          <FileText size={20} />
                        </div>
                        <h2 className={`
                          text-xl font-bold
                          ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                        `}>
                          Existing Assessments
                        </h2>
                      </div>
                      <span className={`
                        text-sm
                        ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                      `}>
                        {items.length} total
                      </span>
                    </div>

                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className={`
                            p-4 rounded-2xl border border-transparent animate-pulse
                            ${theme === 'light'
                              ? 'bg-gray-50 border-gray-100'
                              : 'bg-gray-700/50 border-gray-600/50'
                            }
                          `}>
                            <div className="flex justify-between items-start mb-3">
                              <div className={`h-4 rounded w-32 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`} />
                              <div className={`h-6 rounded w-20 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`} />
                            </div>
                            <div className={`h-3 rounded w-48 mb-2 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`} />
                            <div className={`h-3 rounded w-36 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-600'}`} />
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
                            transition={{ delay: 0.7 + index * 0.1 }}
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
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(assessment.status)}
                                  <div>
                                    <div className={`
                                      font-semibold
                                      ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                    `}>
                                      {assessment.financialYear} Ã¢â‚¬Â¢ ${assessment.assessedValue?.toLocaleString()}
                                    </div>
                                    <div className={`
                                      text-sm mt-1
                                      ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                                    `}>
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
                                  <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Base Tax</div>
                                  <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                                    ${assessment.baseTax}
                                  </div>
                                </div>
                                <div>
                                  <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Exemption</div>
                                  <div className="font-medium text-green-600">{assessment.exemptionPct}%</div>
                                </div>
                                <div>
                                  <div className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}>Total Due</div>
                                  <div className="font-bold text-indigo-600">${assessment.totalDue}</div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                                <div className={`
                                  text-xs
                                  ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                                `}>
                                  Created {new Date(assessment.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  {assessment.status !== 'PAID' && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleMarkPaid(assessment.id)}
                                      className="px-3 py-1 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                                    >
                                      Mark Paid
                                    </motion.button>
                                  )}
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => downloadAssessment(assessment)}
                                    className={`
                                      p-2 rounded-xl text-sm font-medium transition-colors shadow-sm
                                      ${theme === 'light'
                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                      }
                                    `}
                                  >
                                    <Download size={14} />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={async () => {
                                      alert('Delete functionality not implemented yet')
                                    }}
                                    className={`
                                      p-2 rounded-xl text-sm font-medium transition-colors shadow-sm
                                      ${theme === 'light' ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-red-600/30 text-red-300 hover:bg-red-500/30'}
                                    `}
                                  >
                                    <Trash2 size={14} />
                                  </motion.button>
                                </div>
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
                        <FileText size={64} className={`mx-auto mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
                        <h3 className={`
                          text-lg font-semibold mb-2
                          ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                        `}>
                          No assessments found
                        </h3>
                        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          Create your first assessment using the form
                        </p>
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
