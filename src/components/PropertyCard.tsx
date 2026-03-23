 'use client'

import React from 'react'

type Property = {
  id: string
  ownerId?: string
  owner?: string | number | null
  address: string
  ward: string
  ptype: string
  landArea: number
  builtArea: number
  usage: string
  status?: string
  lastAssessment?: string
}
type Props = {
  property: Property
  onEdit?: (p: Property) => void
  onDelete?: (id: number | string) => void
}

export default function PropertyCard({ property, onEdit, onDelete }: Props) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-500">{property.ptype} • {property.usage}</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{property.address}</div>
          <div className="text-xs text-slate-500">
            Ward: {property.ward} • Land: {property.landArea} m² • Built: {property.builtArea} m²
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onEdit?.(property)}
            className="rounded-lg border border-blue-500 bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(property.id)}
            className="rounded-lg border border-red-500 bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
