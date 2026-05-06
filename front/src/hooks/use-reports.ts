import { useState, useCallback, useEffect } from 'react'
import type { ReportFormData, Stats } from '../lib/ui-types'
import { api } from '../lib/api'

export interface PersistedReport {
  id: string
  licensePlate: string
  description: string
  location: string
  contact: string
  date: string
}

function normalizeIdentifier(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

function buildStats(items: PersistedReport[]): Stats {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()

  const today = items.filter((item) => new Date(item.date).getTime() >= startOfDay).length
  const activeZones = new Set(items.map((item) => item.location)).size

  return {
    total: items.length,
    today,
    verified: items.length,
    activeZones,
  }
}

export function useReports() {
  const [reports, setReports] = useState<PersistedReport[]>([])
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/reports')
      const data = Array.isArray(response.data) ? (response.data as PersistedReport[]) : []
      setReports(data)
    } catch {
      setError('No se pudieron cargar los reportes.')
      setReports([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchReports()
  }, [fetchReports])

  const submitReport = useCallback(
    async (data: ReportFormData) => {
      const licensePlate = data.plate.trim() || 'SIN-PLACA'

      await api.post('/reports', {
        licensePlate,
        description: data.description,
        location: data.location || data.region || 'Sin ubicación',
        contact: 'sin_contacto',
      })

      await fetchReports()
    },
    [fetchReports],
  )

  const runSearch = useCallback(() => {
    setSearchQuery(searchInput.trim())
  }, [searchInput])

  const searchMatches = (() => {
    const query = searchQuery.trim()
    if (!query) return []

    const normalizedQuery = normalizeIdentifier(query)
    return reports.filter((report) => normalizeIdentifier(report.licensePlate).includes(normalizedQuery))
  })()

  return {
    reports,
    searchInput,
    setSearchInput,
    searchQuery,
    runSearch,
    searchMatches,
    submitReport,
    stats: buildStats(reports),
    loading,
    error,
  }
}
