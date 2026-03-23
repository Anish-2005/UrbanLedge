 'use client'

import React, { useState } from 'react'

type Payment = {
  id: string
  assessId: string
  paidAmount: number
  paidOn: string
  method: string
  txRef?: string
}
type Props = {
  assessId: string | number
  onPay: (p: Payment) => void
}

export default function PaymentForm({ assessId, onPay }: Props) {
  const [amount, setAmount] = useState(0)
  const [method, setMethod] = useState('CARD')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const p: Payment = {
      id: 'pay' + Date.now(),
      assessId: String(assessId),
      paidAmount: Number(amount),
      paidOn: new Date().toISOString(),
      method,
      txRef: 'TX-' + Date.now()
    }
    onPay(p)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="control-input" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Method</label>
        <select value={method} onChange={e => setMethod(e.target.value)} className="control-input">
          <option value="CARD">Card</option>
          <option value="NETBANK">Netbanking</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      <div>
        <button type="submit" className="btn-primary px-4 py-2">
          Pay
        </button>
      </div>
    </form>
  )
}
