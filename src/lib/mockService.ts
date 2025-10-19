'use client'

// Simple mock service using localStorage to persist demo data for the prototype.

type Role = 'ADMIN' | 'OWNER' | 'ASSESSOR' | 'CASHIER'

export type User = {
  id: string
  username: string
  fullName: string
  roles: Role[]
}

export type Property = {
  id: string
  ownerId: string
  address: string
  ward: string
  ptype: string
  landArea: number
  builtArea: number
  usage: string
}

export type Assessment = {
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

export type Payment = {
  id: string
  assessId: string
  paidAmount: number
  paidOn: string
  method: string
  txRef?: string
}

const LS_PREFIX = 'optms_demo_v1_'

// Safe storage wrapper: uses window.localStorage in browser, otherwise an in-memory fallback.
type StorageLike = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const inMemoryStore = new Map<string, string>()

const safeStorage: StorageLike = (typeof window !== 'undefined' && window.localStorage)
  ? window.localStorage
  : {
    getItem(key: string) {
      return inMemoryStore.has(key) ? inMemoryStore.get(key)! : null
    },
    setItem(key: string, value: string) {
      inMemoryStore.set(key, value)
    }
  }

function read<T>(key: string, fallback: T): T {
  const raw = safeStorage.getItem(LS_PREFIX + key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch (e) {
    return fallback
  }
}

function write<T>(key: string, data: T) {
  try {
    safeStorage.setItem(LS_PREFIX + key, JSON.stringify(data))
  } catch (e) {
    // ignore write errors on server
  }
}

let _initialized = false

function ensureInitialized() {
  if (_initialized) return
  // Only initialize in browser or in-memory mode
  const initFlag = safeStorage.getItem(LS_PREFIX + 'initialized')
  if (initFlag) {
    _initialized = true
    return
  }

  const users: User[] = [
    { id: 'u1', username: 'admin', fullName: 'System Admin', roles: ['ADMIN'] },
    { id: 'u2', username: 'john', fullName: 'John Doe', roles: ['OWNER'] }
  ]

  const properties: Property[] = [
    { id: 'p1', ownerId: 'u2', address: '123 Main St, Apt 4', ward: 'Ward 1', ptype: 'Residential', landArea: 200, builtArea: 120, usage: 'Residential' },
    { id: 'p2', ownerId: 'u2', address: '45 Market Rd', ward: 'Ward 2', ptype: 'Commercial', landArea: 500, builtArea: 350, usage: 'Commercial' }
  ]

  const assessments: Assessment[] = [
    { id: 'a1', propertyId: 'p1', financialYear: '2025-2026', assessedValue: 120 * 10, baseTax: 120 * 10, exemptionPct: 0, penalty: 0, totalDue: 120 * 10, status: 'PARTIAL' },
    { id: 'a2', propertyId: 'p2', financialYear: '2025-2026', assessedValue: 350 * 15, baseTax: 350 * 15, exemptionPct: 0, penalty: 0, totalDue: 350 * 15, status: 'DUE' }
  ]

  const payments: Payment[] = [
    { id: 'pay1', assessId: 'a1', paidAmount: 600, paidOn: new Date().toISOString(), method: 'CARD', txRef: 'TX-1234' }
  ]

  write('users', users)
  write('properties', properties)
  write('assessments', assessments)
  write('payments', payments)
  safeStorage.setItem(LS_PREFIX + 'initialized', '1')
  _initialized = true
}

export const mockService = {
  users: {
    list: (): User[] => { ensureInitialized(); return read<User[]>('users', []) },
    get: (id: string) => { ensureInitialized(); return read<User[]>('users', []).find(u => u.id === id) },
  },

  properties: {
    list: (): Property[] => { ensureInitialized(); return read<Property[]>('properties', []) },
    create: (p: Property) => { ensureInitialized(); const arr = read<Property[]>('properties', []); arr.unshift(p); write('properties', arr); return p },
    update: (p: Property) => { ensureInitialized(); const arr = read<Property[]>('properties', []); const idx = arr.findIndex(x => x.id === p.id); if (idx >= 0) arr[idx] = p; write('properties', arr); return p },
    delete: (id: string) => { ensureInitialized(); const arr = read<Property[]>('properties', []); write('properties', arr.filter(x => x.id !== id)) }
  },

  assessments: {
    list: (): Assessment[] => { ensureInitialized(); return read<Assessment[]>('assessments', []) },
    create: (a: Assessment) => { ensureInitialized(); const arr = read<Assessment[]>('assessments', []); arr.unshift(a); write('assessments', arr); return a },
    update: (a: Assessment) => { ensureInitialized(); const arr = read<Assessment[]>('assessments', []); const idx = arr.findIndex(x => x.id === a.id); if (idx >= 0) arr[idx] = a; write('assessments', arr); return a }
  },

  payments: {
    list: (): Payment[] => { ensureInitialized(); return read<Payment[]>('payments', []) },
    create: (p: Payment) => {
      ensureInitialized()
      const arr = read<Payment[]>('payments', [])
      arr.unshift(p)
      write('payments', arr)
      // reduce assessment due
      const assessments = read<Assessment[]>('assessments', [])
      const idx = assessments.findIndex(a => a.id === p.assessId)
      if (idx >= 0) {
        const a = assessments[idx]
        a.totalDue = Math.max(0, a.totalDue - p.paidAmount)
        a.status = a.totalDue === 0 ? 'PAID' : (a.totalDue < a.baseTax ? 'PARTIAL' : 'DUE')
        assessments[idx] = a
        write('assessments', assessments)
      }
      write('payments', arr)
      return p
    }
  }
}
