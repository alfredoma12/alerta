import { useState, useCallback, useEffect } from 'react'
import type { Report } from '../lib/ui-types'
import type { Stats } from '../lib/ui-types'
import type { SearchMode } from '../lib/ui-types'
import type { ReportFormData } from '../lib/ui-types'
import { api } from '../lib/api'
import type { TopAccount, Zone } from '../lib/ui-types'

interface ApiEvidence {
  url?: string | null
  text?: string | null
}

interface ApiReport {
  id: number | string
  type?: 'SCAM' | 'VEHICLE'
  name?: string | null
  rut?: string | null
  plate?: string | null
  licensePlate?: string | null
  description: string
  status?: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt?: string
  date?: string
  location?: string | null
  evidence?: ApiEvidence[]
}

function mapApiReport(item: ApiReport): Report {
  const plate = item.plate || item.licensePlate || null
  const category = item.type === 'SCAM' ? 'estafa' : 'vehiculo_robado'
  const title = item.name?.trim()
    ? `Reporte de ${item.name.trim()}`
    : category === 'vehiculo_robado'
      ? `Vehículo reportado ${plate ? `(${plate})` : ''}`.trim()
      : `Denuncia por estafa ${item.rut ? `(${item.rut})` : ''}`.trim()

  const evidence = (item.evidence || [])
    .map((e) => e.url || e.text)
    .filter((value): value is string => Boolean(value && value.trim()))

  return {
    id: String(item.id),
    title,
    description: item.description,
    category,
    location: item.location || (plate ? `Patente ${plate}` : item.rut ? `RUT ${item.rut}` : 'Sin referencia pública'),
    region: 'Nacional',
    // Published reports should appear immediately without review states.
    status: 'verified',
    votes: 0,
    userVote: null,
    createdAt: item.createdAt || item.date || new Date().toISOString(),
    isAnonymous: true,
    evidence,
    plate: plate || undefined,
    scamRut: item.rut || undefined,
    verificationState: 'community_verified',
    flagsCount: 0,
  }
}

function normalizePlate(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

function normalizeRut(value: string): string {
  return value.replace(/[^0-9kK]/g, '').toUpperCase()
}

function buildStats(items: Report[]): Stats {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  const today = items.filter((item) => new Date(item.createdAt).getTime() >= startOfDay).length
  const verified = items.filter((item) => item.status === 'verified').length
  const activeZones = new Set(items.map((item) => item.location)).size

  return {
    total: items.length,
    today,
    verified,
    activeZones,
  }
}

function buildZones(items: Report[]): Zone[] {
  const map = new Map<string, Zone>()

  items.forEach((item) => {
    const key = `${item.location}|${item.region}`
    const existing = map.get(key)
    if (existing) {
      existing.count += 1
      return
    }

    map.set(key, {
      name: item.location,
      region: item.region,
      count: 1,
      trend: 'stable',
    })
  })

  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
}

function buildTopAccounts(items: Report[]): TopAccount[] {
  const map = new Map<string, TopAccount>()

  items.forEach((item) => {
    const handle = item.author || item.location || 'Sin referencia'
    const existing = map.get(handle)
    if (existing) {
      existing.reports += 1
      return
    }

    map.set(handle, {
      handle,
      platform: 'registro',
      reports: 1,
      category: item.category,
    })
  })

  return Array.from(map.values())
    .sort((a, b) => b.reports - a.reports)
    .slice(0, 6)
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([])
  const [searchMode, setSearchMode] = useState<SearchMode>('vehicle')
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/search', {
        params: search.trim() ? { q: search.trim() } : undefined,
      })

      const items = ((response.data?.items || []) as ApiReport[]).map(mapApiReport)
      setReports(items)
    } catch {
      setError('No se pudieron cargar las denuncias reales.')
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    let cancelled = false

    const timeout = window.setTimeout(() => {
      void (async () => {
        if (cancelled) return
        await fetchReports()
      })()
    }, 250)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [fetchReports])

  const filtered = reports.filter((r) => {
    const matchCat = filter === 'all' || r.category === filter
    const matchSearch =
      search.trim() === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const vehicleReports = reports.filter((r) => r.category === 'vehiculo_robado')
  const scamReports = reports.filter((r) => r.category !== 'vehiculo_robado')

  const instantResult = (() => {
    const query = search.trim()
    if (!query) return null

    if (searchMode === 'vehicle') {
      const target = normalizePlate(query)
      return vehicleReports.find((r) => normalizePlate(r.plate || r.location || '').includes(target)) || null
    }

    const targetRut = normalizeRut(query)
    const lower = query.toLowerCase()
    return (
      scamReports.find((r) => {
        const rut = normalizeRut(r.scamRut || r.location || '')
        const title = r.title.toLowerCase()
        const desc = r.description.toLowerCase()
        return (targetRut.length > 4 && rut.includes(targetRut)) || title.includes(lower) || desc.includes(lower)
      }) || null
    )
  })()

  const vote = useCallback((id: string, direction: 'up' | 'down') => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        if (r.userVote === direction) {
          return { ...r, votes: r.votes + (direction === 'up' ? -1 : 1), userVote: null }
        }
        const delta = r.userVote == null ? (direction === 'up' ? 1 : -1) : direction === 'up' ? 2 : -2
        return { ...r, votes: r.votes + delta, userVote: direction }
      }),
    )
  }, [])

  const submitReport = useCallback(
    async (data: ReportFormData) => {
      if (data.mode === 'vehicle') {
        await api.post('/reports', {
          type: 'VEHICLE',
          licensePlate: data.plate,
          description: data.description,
          location: data.location || `Patente ${data.plate}`,
          contact: 'sin_contacto',
        })
      } else {
        await api.post('/reports', {
          type: 'SCAM',
          personName: data.personName,
          rut: data.rut,
          alias: data.alias || undefined,
          scamType: data.scamType,
          description: data.description,
          location: data.location || `RUT ${data.rut}`,
          contact: 'sin_contacto',
        })
      }

      await fetchReports()
    },
    [fetchReports],
  )

  return {
    reports: filtered,
    vehicleReports,
    scamReports,
    instantResult,
    searchMode,
    setSearchMode,
    filter,
    setFilter,
    search,
    setSearch,
    vote,
    submitReport,
    stats: buildStats(reports),
    zones: buildZones(reports),
    topAccounts: buildTopAccounts(reports),
    loading,
    error,
  }
}
