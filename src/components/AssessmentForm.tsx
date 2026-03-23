 'use client'

import React, { useState } from 'react'

type Assessment = {
  id: string
  propertyId: string
  financialYear: string
  assessedValue: number
  baseTax: number
  exemptionPct: number
  penalty: number
  totalDue: number
  status: 'DUE' | 'PAID' | 'PARTIAL' | 'WRITTEN_OFF'
}
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
      propertyId: initial.propertyId || '',
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
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Financial Year</label>
        <input value={financialYear} onChange={e => setFinancialYear(e.target.value)} className="control-input" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Assessed Value</label>
        <input type="number" value={assessedValue} onChange={e => setAssessedValue(Number(e.target.value))} className="control-input" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">Exemption (%)</label>
        <input type="number" value={exemptionPct} onChange={e => setExemptionPct(Number(e.target.value))} className="control-input" />
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" className="btn-primary px-4 py-2">
          Save
        </button>
      </div>
    </form>
  )
}
