'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Home, MapPin, FileText, CreditCard, Settings, Search, 
  Plus, Edit2, Trash2, Building, Users, Calendar,
  ArrowRight, ChevronRight, DollarSign, Target,
  HomeIcon, MapPinned, SquareStack, Calculator,
  CheckCircle, Clock, AlertCircle, Download,
  CreditCardIcon, Banknote, QrCode, Receipt,
  TrendingUp, Wallet, Shield, Zap
} from 'lucide-react'
import Header from '../../components/Header'
import SidebarNav from '@/components/SidebarNav'
import { mockService } from '@/lib/mockService'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    fetchAll()
  }, [])

  async function fetchAll() {
    try {
      setLoading(true)
      const pRows = mockService.payments.list()
      const aRows = mockService.assessments.list()
      setPayments((pRows ?? []).map((r: any) => ({ id: r.id, method: r.method ?? r.payment_method, paidAmount: Number(r.paidAmount ?? r.paid_amount), paidOn: new Date(r.paidOn ?? r.paid_on), txRef: r.txRef ?? r.transaction_ref, assessId: r.assessId ?? r.assess_id, status: r.status ?? 'COMPLETED', propertyAddress: '' })))
      setAssessments((aRows ?? []).map((r: any) => ({ id: r.id, financialYear: r.financialYear ?? r.financial_year, assessedValue: Number(r.assessedValue ?? r.assessed_value), totalDue: Number(r.totalDue ?? r.total_due), propertyAddress: mockService.properties.list().find(p => p.id === r.propertyId)?.address || '', status: r.status })))
      setLoading(false)
    } catch (e) { 
      setPayments([])
      setAssessments([])
      setLoading(false)
    }
  }

  async function handlePay(payment: any) {
    try {
      
  const payload = { id: 'pay' + Date.now(), assessId: String(payment.assessId), paidAmount: Number(payment.paidAmount), paidOn: new Date().toISOString(), method: payment.method, txRef: payment.txRef }
  mockService.payments.create(payload)
  // refresh lists
  await fetchAll()
    } catch (e) { 
      console.error(e) 
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
      // Reset form
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
        case 'CREDIT_CARD': return 'bg-blue-500'
        case 'BANK_TRANSFER': return 'bg-green-500'
        case 'UPI': return 'bg-purple-500'
        default: return 'bg-gray-500'
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Assessment</label>
          <select 
            value={selectedAssessment} 
            onChange={e => {
              setSelectedAssessment(e.target.value)
              const assessment = assessments.find(a => a.id === Number(e.target.value))
              if (assessment) {
                setAmount(assessment.totalDue.toString())
              }
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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
            className="bg-blue-50 rounded-xl p-4 border border-blue-200"
          >
            <div className="text-sm font-medium text-blue-900 mb-2">Selected Assessment</div>
            <div className="text-sm text-blue-700">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount ($)</label>
          <input 
            type="number" 
            value={amount} 
            onChange={e => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter amount"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
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
                className={`p-3 border-2 rounded-xl text-center transition-all duration-200 ${
                  method === option.value 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-8 h-8 ${getMethodColor(option.value)} rounded-lg flex items-center justify-center text-white mx-auto mb-2`}>
                  <option.icon size={16} />
                </div>
                <div className="text-xs font-medium text-gray-700">{option.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        {amount && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-50 rounded-xl p-4 space-y-2"
          >
            <div className="text-sm font-medium text-gray-700 mb-2">Payment Summary</div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">${Number(amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-medium">$0.00</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span className="text-indigo-600">${Number(amount).toFixed(2)}</span>
            </div>
          </motion.div>
        )}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!amount || !selectedAssessment}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl py-3 font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Process Payment
        </motion.button>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield size={12} />
          <span>Your payment is secure and encrypted</span>
        </div>
      </motion.form>
    )
  }

  const stats = [
    { label: 'Total Payments', value: payments.length.toString(), icon: CreditCard, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: '$' + payments.reduce((sum, p) => sum + p.paidAmount, 0).toFixed(2), icon: DollarSign, color: 'bg-green-500' },
    { label: 'Pending Payments', value: assessments.filter(a => a.status === 'DUE').length.toString(), icon: Clock, color: 'bg-yellow-500' },
    { label: 'Success Rate', value: '100%', icon: TrendingUp, color: 'bg-purple-500' },
  ]

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'CREDIT_CARD': return <CreditCardIcon size={16} className="text-blue-600" />
      case 'BANK_TRANSFER': return <Banknote size={16} className="text-green-600" />
      case 'UPI': return <QrCode size={16} className="text-purple-600" />
      default: return <CreditCardIcon size={16} className="text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'FAILED': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
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
                  <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                  <p className="text-gray-600 mt-2">Process payments and view transaction history</p>
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
                {/* Payment Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-1"
                >
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CreditCard size={18} className="text-green-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">Make Payment</h2>
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
                  transition={{ delay: 0.5 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Receipt size={18} className="text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                      </div>
                      <span className="text-sm text-gray-500">{payments.length} transactions</span>
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
                        {payments.map((payment, index) => (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="p-4 border border-gray-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {getMethodIcon(payment.method)}
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    ${payment.paidAmount} • {payment.method.replace('_', ' ')}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
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
                                <Calendar size={14} className="text-gray-400" />
                                <span>{payment.paidOn.toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Receipt size={14} className="text-gray-400" />
                                <span>{payment.txRef}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="text-xs text-gray-500">
                                Processed {payment.paidOn.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                  Download Receipt
                                </motion.button>
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

                    {!loading && payments.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <Receipt size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
                        <p className="text-gray-600">Process your first payment using the form</p>
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