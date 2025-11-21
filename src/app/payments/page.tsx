'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Building, Users, Calendar, MapPinned, SquareStack,
  ChevronRight, TrendingUp, DollarSign, Target, FileText, Calculator,
  CheckCircle, Clock, AlertCircle, Download, ArrowRight,
  CreditCardIcon, Banknote, QrCode, Receipt, Shield, Zap, Wallet
} from 'lucide-react'
import Header from '../../components/Header'
import SidebarNav from '@/components/SidebarNav'
import { mockService } from '@/lib/mockService'
import { useTheme } from '@/contexts/ThemeContext'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => { 
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      setLoading(true)
      const pRows = mockService.payments.list()
      const aRows = mockService.assessments.list()
      setPayments((pRows ?? []).map((r: any) => ({ 
        id: r.id, 
        method: r.method ?? r.payment_method, 
        paidAmount: Number(r.paidAmount ?? r.paid_amount), 
        paidOn: new Date(r.paidOn ?? r.paid_on), 
        txRef: r.txRef ?? r.transaction_ref, 
        assessId: r.assessId ?? r.assess_id, 
        status: r.status ?? 'COMPLETED', 
        propertyAddress: '' 
      })))
      setAssessments((aRows ?? []).map((r: any) => ({ 
        id: r.id, 
        financialYear: r.financialYear ?? r.financial_year, 
        assessedValue: Number(r.assessedValue ?? r.assessed_value), 
        totalDue: Number(r.totalDue ?? r.total_due), 
        propertyAddress: mockService.properties.list().find(p => p.id === r.propertyId)?.address || '', 
        status: r.status 
      })))
      setLoading(false)
    } catch (e) { 
      setPayments([])
      setAssessments([])
      setLoading(false)
    }
  }

  async function handlePay(payment: any) {
    try {
      const payload = { 
        id: 'pay' + Date.now(), 
        assessId: String(payment.assessId), 
        paidAmount: Number(payment.paidAmount), 
        paidOn: new Date().toISOString(), 
        method: payment.method, 
        txRef: payment.txRef 
      }
      mockService.payments.create(payload)
      
      // Log activity
      const { logActivity } = await import('@/lib/mockService')
      const assessment = assessments.find(a => String(a.id) === String(payment.assessId))
      logActivity('u2', 'john', 'CREATE', 'payment', payload.id, 
        `Payment for ${assessment?.propertyAddress || 'Unknown Property'}`, 
        `Paid $${payload.paidAmount} via ${payload.method}`)
      
      await fetchAll()
    } catch (e) { 
      console.error(e) 
    }
  }

  // Open a printable receipt window and trigger print (user can save as PDF)
  function printReceipt(payment: any) {
    try {
      const assessment = assessments.find(a => String(a.id) === String(payment.assessId))
      const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Receipt ${payment.id}</title><style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111} .header{display:flex;justify-content:space-between;align-items:center}.brand{font-size:18px;font-weight:700}.section{margin-top:16px}.row{display:flex;justify-content:space-between;margin:6px 0}.total{font-size:18px;font-weight:700;margin-top:12px}@media print{button{display:none}}</style></head><body>
        <div class="header"><div class="brand">UrbanLedge</div><div>Receipt</div></div>
        <div class="section">
          <div class="row"><span>Receipt ID</span><span>${payment.id}</span></div>
          <div class="row"><span>Transaction Ref</span><span>${payment.txRef || ''}</span></div>
          <div class="row"><span>Date</span><span>${new Date(payment.paidOn).toLocaleString()}</span></div>
        </div>
        <div class="section">
          <div class="row"><span>Property</span><span>${assessment?.propertyAddress || ''}</span></div>
          <div class="row"><span>Financial Year</span><span>${assessment?.financialYear || ''}</span></div>
        </div>
        <div class="section">
          <div class="row"><span>Method</span><span>${payment.method}</span></div>
          <div class="row total"><span>Total Paid</span><span>$${Number(payment.paidAmount).toFixed(2)}</span></div>
        </div>
        <div style="margin-top:18px"><button onclick="window.print();">Print / Save as PDF</button></div>
      </body></html>`

      // Open synchronously in response to user click to avoid popup blocking
      const w = window.open('about:blank', '_blank')
      if (w) {
        // Write content and focus; printing is triggered by the user via the button in the new window
        w.document.open()
        w.document.write(html)
        w.document.close()
        w.focus()
      } else {
        // Fallback: create downloadable HTML file that the user can open and print
        try {
          const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `receipt-${payment.id}.html`
          document.body.appendChild(a)
          a.click()
          a.remove()
          URL.revokeObjectURL(url)
          alert('Popups are blocked. The receipt HTML was downloaded; open it and print to PDF (File → Print).')
        } catch (err) {
          console.error('Fallback failed', err)
          alert('Unable to open receipt window. Please allow popups or check downloads.')
        }
      }
    } catch (err) {
      console.error('Failed to print receipt', err)
      alert('Failed to generate receipt')
    }
  }

  const PaymentForm = ({ assessId, onPay }: any) => {
    const [amount, setAmount] = useState('')
    const [method, setMethod] = useState('CREDIT_CARD')
    const [selectedAssessment, setSelectedAssessment] = useState(assessId)

    const currentAssessment = assessments.find(a => a.id === Number(selectedAssessment))

    function submit(e: React.FormEvent) {
      e.preventDefault()
      const payment = {
        id: 'pay' + Date.now(),
        assessId: Number(selectedAssessment),
        paidAmount: Number(amount),
        paidOn: new Date().toISOString(),
        method,
        txRef: 'TX-' + Date.now()
      }
      onPay(payment)
      setAmount('')
      setMethod('CREDIT_CARD')
    }

    const getMethodIcon = (method: string) => {
      switch (method) {
        case 'CREDIT_CARD': return <CreditCardIcon size={20} />
        case 'BANK_TRANSFER': return <Banknote size={20} />
        case 'UPI': return <QrCode size={20} />
        default: return <CreditCardIcon size={20} />
      }
    }

    const getMethodColor = (method: string) => {
      switch (method) {
        case 'CREDIT_CARD': return 'from-blue-500 to-cyan-600'
        case 'BANK_TRANSFER': return 'from-emerald-500 to-teal-600'
        case 'UPI': return 'from-purple-500 to-pink-600'
        default: return 'from-gray-500 to-gray-600'
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
            Select Assessment
          </label>
          <select 
            value={selectedAssessment} 
            onChange={e => {
              setSelectedAssessment(e.target.value)
              const assessment = assessments.find(a => a.id === Number(e.target.value))
              if (assessment) {
                setAmount(assessment.totalDue.toString())
              }
            }}
            className={`
              w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200
              ${theme === 'light'
                ? 'border border-gray-300 bg-white text-gray-900'
                : 'border border-gray-600 bg-gray-700 text-white'
              }
            `}
            required
          >
            <option value="">Select an assessment</option>
            {assessments.filter(a => a.status === 'DUE').map(assessment => (
              <option key={assessment.id} value={assessment.id}>
                {assessment.propertyAddress} - ${assessment.totalDue}
              </option>
            ))}
          </select>
        </div>

        {currentAssessment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`
              rounded-2xl p-4 border
              ${theme === 'light'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-blue-500/10 border-blue-500/20'
              }
            `}
          >
            <div className={`text-sm font-medium ${theme === 'light' ? 'text-blue-900' : 'text-blue-300'} mb-2`}>
              Selected Assessment
            </div>
            <div className={`text-sm ${theme === 'light' ? 'text-blue-700' : 'text-blue-400'}`}>
              <div>{currentAssessment.propertyAddress}</div>
              <div className="flex justify-between mt-1">
                <span>Financial Year:</span>
                <span className="font-medium">{currentAssessment.financialYear}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Amount Due:</span>
                <span className="font-bold">${currentAssessment.totalDue}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Payment Amount ($)
          </label>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className={`
              w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200
              ${theme === 'light'
                ? 'border border-gray-300 bg-white text-gray-900'
                : 'border border-gray-600 bg-gray-700 text-white'
              }
            `}
            placeholder="Enter amount"
            required
            min="1"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-3 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'CREDIT_CARD', label: 'Card', icon: CreditCardIcon },
              { value: 'BANK_TRANSFER', label: 'Bank', icon: Banknote },
              { value: 'UPI', label: 'UPI', icon: QrCode }
            ].map((option) => (
              <motion.button
                key={option.value}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMethod(option.value)}
                className={`
                  p-3 border-2 rounded-2xl text-center transition-all duration-200
                  ${method === option.value 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20' 
                    : theme === 'light'
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-600 hover:border-gray-500'
                  }
                `}
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${getMethodColor(option.value)} rounded-xl flex items-center justify-center text-white mx-auto mb-2 shadow-sm`}>
                  <option.icon size={16} />
                </div>
                <div className={`text-xs font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {option.label}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        {amount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`
              rounded-2xl p-4 space-y-2
              ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}
            `}
          >
            <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
              Payment Summary
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Amount:</span>
              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                ${Number(amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>Processing Fee:</span>
              <span className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>$0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>Total:</span>
              <span className="text-indigo-600">${Number(amount).toFixed(2)}</span>
            </div>
          </motion.div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!amount || !selectedAssessment}
          className={`
            w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl py-3 font-medium 
            shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            hover:from-emerald-700 hover:to-green-700
          `}
        >
          Process Payment
        </motion.button>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Shield size={12} />
          <span>Your payment is secure and encrypted</span>
        </div>
      </motion.form>
    )
  }

  const stats = [
    { 
      label: 'Total Payments', 
      value: payments.length.toString(),
      change: '+15.2%', 
      icon: CreditCardIcon, 
      gradient: 'from-blue-500 to-indigo-600',
      description: 'All time transactions',
      trend: 'up'
    },
    { 
      label: 'Total Revenue', 
      value: '$' + payments.reduce((sum, p) => sum + p.paidAmount, 0).toFixed(2),
      change: '+22.8%', 
      icon: DollarSign, 
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Current fiscal year',
      trend: 'up'
    },
    { 
      label: 'Pending Payments', 
      value: assessments.filter(a => a.status === 'DUE').length.toString(),
      change: '-5.3%', 
      icon: Clock, 
      gradient: 'from-amber-500 to-orange-600',
      description: 'Awaiting processing',
      trend: 'down'
    },
    { 
      label: 'Success Rate', 
      value: '100%',
      change: '+0.5%', 
      icon: TrendingUp, 
      gradient: 'from-purple-500 to-pink-600',
      description: 'Transaction success',
      trend: 'up'
    },
  ]

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD': return <CreditCardIcon size={16} className="text-blue-500" />
      case 'BANK_TRANSFER': return <Banknote size={16} className="text-emerald-500" />
      case 'UPI': return <QrCode size={16} className="text-purple-500" />
      default: return <CreditCardIcon size={16} className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30'
      case 'FAILED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/30'
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
                    Payment Processing
                  </h1>
                  <p className={`
                    mt-2 text-lg
                    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                    Process payments and view transaction history
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
                {/* Payment Form */}
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
                        bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg
                      `}>
                        <CreditCardIcon size={20} />
                      </div>
                      <h2 className={`
                        text-xl font-bold
                        ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                      `}>
                        Make Payment
                      </h2>
                    </div>
                    <PaymentForm 
                      assessId={assessments[0]?.id || ''} 
                      onPay={handlePay} 
                    />
                  </div>
                </motion.div>

                {/* Payments History */}
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
                          <Receipt size={20} />
                        </div>
                        <h2 className={`
                          text-xl font-bold
                          ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                        `}>
                          Payment History
                        </h2>
                      </div>
                      <span className={`
                        text-sm
                        ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                      `}>
                        {payments.length} transactions
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
                        {payments.map((payment, index) => (
                          <motion.div
                            key={payment.id}
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
                                  {getMethodIcon(payment.method)}
                                  <div>
                                    <div className={`
                                      font-semibold
                                      ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                                    `}>
                                      ${payment.paidAmount} • {payment.method.replace('_', ' ')}
                                    </div>
                                    <div className={`
                                      text-sm mt-1
                                      ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}
                                    `}>
                                      {payment.propertyAddress}
                                    </div>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                                  {payment.status}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
                                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                                    {payment.paidOn.toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Receipt size={14} className={theme === 'light' ? 'text-gray-400' : 'text-gray-500'} />
                                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                                    {payment.txRef}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                                <div className={`
                                  text-xs
                                  ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                                `}>
                                  Processed {payment.paidOn.toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => printReceipt(payment)}
                                    className="px-3 py-1 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                                  >
                                    Download Receipt
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => printReceipt(payment)}
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
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {!loading && payments.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <Receipt size={64} className={`mx-auto mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}`} />
                        <h3 className={`
                          text-lg font-semibold mb-2
                          ${theme === 'light' ? 'text-gray-900' : 'text-white'}
                        `}>
                          No payments found
                        </h3>
                        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
                          Process your first payment using the form
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