 'use client'

import React from 'react'

type PropType = any
type Props = {
  property: PropType
  onEdit?: (p: PropType) => void
  onDelete?: (id: number | string) => void
}

export default function PropertyCard({ property, onEdit, onDelete }: Props) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">{property.ptype} • {property.usage}</div>
          <div className="text-lg font-medium">{property.address}</div>
          <div className="text-xs text-gray-500">Ward: {property.ward} • Land: {property.landArea}m² • Built: {property.builtArea}m²</div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => onEdit?.(property)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Edit</button>
          <button onClick={() => onDelete?.(property.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
        </div>
      </div>
    </div>
  )
}
