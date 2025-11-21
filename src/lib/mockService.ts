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

export type TaxSlab = {
  id: string
  ptype_id: string
  property_type_name: string
  min_area: number
  max_area: number | null
  base_rate_per_sq_m: number
  effective_from: string | null
  effective_to: string | null
  active: boolean
}

export type Exemption = {
  id: string
  category: string
  description: string
  discount_pct: number
  active: boolean
}

export type Ward = {
  id: string
  ward_name: string
  zone: string
  population: number
  area_sq_km: number
}

export type UserRole = {
  id: string
  role_name: string
  description: string
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

  const taxSlabs: TaxSlab[] = [
    { id: 'ts1', ptype_id: 'residential', property_type_name: 'Residential', min_area: 0, max_area: 1000, base_rate_per_sq_m: 10, effective_from: '2025-01-01', effective_to: null, active: true },
    { id: 'ts2', ptype_id: 'commercial', property_type_name: 'Commercial', min_area: 0, max_area: 2000, base_rate_per_sq_m: 25, effective_from: '2025-01-01', effective_to: null, active: true },
    { id: 'ts3', ptype_id: 'industrial', property_type_name: 'Industrial', min_area: 0, max_area: 5000, base_rate_per_sq_m: 15, effective_from: '2025-01-01', effective_to: null, active: true }
  ]

  const exemptions: Exemption[] = [
    { id: 'ex1', category: 'Senior Citizen', description: 'For property owners aged 60+', discount_pct: 15, active: true },
    { id: 'ex2', category: 'Disabled', description: 'For physically challenged owners', discount_pct: 25, active: true },
    { id: 'ex3', category: 'Veteran', description: 'For military veterans', discount_pct: 20, active: true }
  ]

  const wards: Ward[] = [
    { id: 'w1', ward_name: 'Ward 1', zone: 'North', population: 15000, area_sq_km: 5.2 },
    { id: 'w2', ward_name: 'Ward 2', zone: 'South', population: 18000, area_sq_km: 6.8 },
    { id: 'w3', ward_name: 'Ward 3', zone: 'East', population: 12000, area_sq_km: 4.5 }
  ]

  const roles: UserRole[] = [
    { id: 'r1', role_name: 'ADMIN', description: 'System Administrator' },
    { id: 'r2', role_name: 'OWNER', description: 'Property Owner' },
    { id: 'r3', role_name: 'ASSESSOR', description: 'Tax Assessor' },
    { id: 'r4', role_name: 'CASHIER', description: 'Payment Cashier' }
  ]

  write('users', users)
  write('properties', properties)
  write('assessments', assessments)
  write('payments', payments)
  write('taxSlabs', taxSlabs)
  write('exemptions', exemptions)
  write('wards', wards)
  write('roles', roles)
  safeStorage.setItem(LS_PREFIX + 'initialized', '1')
  _initialized = true
}

export const mockService = {
  users: {
    list: (): User[] => { ensureInitialized(); return read<User[]>('users', []) },
    get: (id: string) => { ensureInitialized(); return read<User[]>('users', []).find(u => u.id === id) },
    create: (u: User) => { ensureInitialized(); const arr = read<User[]>('users', []); arr.unshift(u); write('users', arr); return u },
    update: (u: User) => { ensureInitialized(); const arr = read<User[]>('users', []); const idx = arr.findIndex(x => x.id === u.id); if (idx >= 0) arr[idx] = u; write('users', arr); return u },
    delete: (id: string) => { ensureInitialized(); const arr = read<User[]>('users', []); write('users', arr.filter(x => x.id !== id)) }
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
    update: (a: Assessment) => { ensureInitialized(); const arr = read<Assessment[]>('assessments', []); const idx = arr.findIndex(x => x.id === a.id); if (idx >= 0) arr[idx] = a; write('assessments', arr); return a },
    delete: (id: string) => { ensureInitialized(); const arr = read<Assessment[]>('assessments', []); write('assessments', arr.filter(x => x.id !== id)) }
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
  },

  taxSlabs: {
    list: (): TaxSlab[] => { ensureInitialized(); return read<TaxSlab[]>('taxSlabs', []) },
    create: (t: TaxSlab) => { ensureInitialized(); const arr = read<TaxSlab[]>('taxSlabs', []); arr.unshift(t); write('taxSlabs', arr); return t },
    update: (t: TaxSlab) => { ensureInitialized(); const arr = read<TaxSlab[]>('taxSlabs', []); const idx = arr.findIndex(x => x.id === t.id); if (idx >= 0) arr[idx] = t; write('taxSlabs', arr); return t },
    delete: (id: string) => { ensureInitialized(); const arr = read<TaxSlab[]>('taxSlabs', []); write('taxSlabs', arr.filter(x => x.id !== id)) }
  },

  exemptions: {
    list: (): Exemption[] => { ensureInitialized(); return read<Exemption[]>('exemptions', []) },
    create: (e: Exemption) => { ensureInitialized(); const arr = read<Exemption[]>('exemptions', []); arr.unshift(e); write('exemptions', arr); return e },
    update: (e: Exemption) => { ensureInitialized(); const arr = read<Exemption[]>('exemptions', []); const idx = arr.findIndex(x => x.id === e.id); if (idx >= 0) arr[idx] = e; write('exemptions', arr); return e },
    delete: (id: string) => { ensureInitialized(); const arr = read<Exemption[]>('exemptions', []); write('exemptions', arr.filter(x => x.id !== id)) },
    toggle: (id: string) => { 
      ensureInitialized(); 
      const arr = read<Exemption[]>('exemptions', []); 
      const idx = arr.findIndex(x => x.id === id); 
      if (idx >= 0) {
        arr[idx].active = !arr[idx].active;
        write('exemptions', arr);
        return arr[idx];
      }
      return null;
    }
  },

  wards: {
    list: (): Ward[] => { ensureInitialized(); return read<Ward[]>('wards', []) },
    create: (w: Ward) => { ensureInitialized(); const arr = read<Ward[]>('wards', []); arr.unshift(w); write('wards', arr); return w },
    update: (w: Ward) => { ensureInitialized(); const arr = read<Ward[]>('wards', []); const idx = arr.findIndex(x => x.id === w.id); if (idx >= 0) arr[idx] = w; write('wards', arr); return w },
    delete: (id: string) => { ensureInitialized(); const arr = read<Ward[]>('wards', []); write('wards', arr.filter(x => x.id !== id)) }
  },

  roles: {
    list: (): UserRole[] => { ensureInitialized(); return read<UserRole[]>('roles', []) },
    create: (r: UserRole) => { ensureInitialized(); const arr = read<UserRole[]>('roles', []); arr.unshift(r); write('roles', arr); return r },
    update: (r: UserRole) => { ensureInitialized(); const arr = read<UserRole[]>('roles', []); const idx = arr.findIndex(x => x.id === r.id); if (idx >= 0) arr[idx] = r; write('roles', arr); return r },
    delete: (id: string) => { ensureInitialized(); const arr = read<UserRole[]>('roles', []); write('roles', arr.filter(x => x.id !== id)) }
  }
}
