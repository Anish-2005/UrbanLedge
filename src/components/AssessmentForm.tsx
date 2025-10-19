 'use client'

import React, { useState } from 'react'

type Assessment = any
type Props = {
  initial?: Partial<Assessment>
  onSave: (a: Assessment) => void
}

export default function AssessmentForm({ initial = {}, onSave }: Props) {
  const [financialYear, setFinancialYear] = useState(initial.financialYear || '2025-2026')
  const [assessedValue, setAssessedValue] = useState(initial.assessedValue || 0)
  const [exemptionPct, setExemptionPct] = useState(initial.exemptionPct || 0)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const a: Assessment = {
      id: initial.id || 'a' + Date.now(),
      propertyId: initial.propertyId || initial.property_id || '',
      financialYear,
      assessedValue: Number(assessedValue),
      baseTax: Number(assessedValue),
      exemptionPct: Number(exemptionPct),
      penalty: 0,
      totalDue: Number(assessedValue) - (Number(assessedValue) * Number(exemptionPct) / 100),
      status: 'DUE'
    }
    onSave(a)
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm text-gray-700">Financial Year</label>
        <input value={financialYear} onChange={e => setFinancialYear(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Assessed Value</label>
        <input type="number" value={assessedValue} onChange={e => setAssessedValue(Number(e.target.value))} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Exemption (%)</label>
        <input type="number" value={exemptionPct} onChange={e => setExemptionPct(Number(e.target.value))} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}
