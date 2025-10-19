 'use client'

import React, { useState } from 'react'

type Payment = any
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
      assessId,
      paidAmount: Number(amount),
      paidOn: new Date().toISOString(),
      method,
      txRef: 'TX-' + Date.now()
    }
    onPay(p)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-700">Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Method</label>
        <select value={method} onChange={e => setMethod(e.target.value)} className="mt-1 block w-full border rounded p-2">
          <option value="CARD">Card</option>
          <option value="NETBANK">Netbanking</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      <div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Pay</button>
      </div>
    </form>
  )
}
