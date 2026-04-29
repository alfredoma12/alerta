import { TrendingUp, AlertTriangle, CheckCircle, MapPin } from 'lucide-react'
import type { Stats } from '../lib/ui-types'
import { formatNumber } from '../lib/ui-utils'

interface StatsBarProps {
  stats: Stats
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { icon: TrendingUp, label: 'Total denuncias', value: formatNumber(stats.total), color: 'text-foreground', iconColor: 'text-primary' },
    { icon: AlertTriangle, label: 'Hoy', value: String(stats.today), color: 'text-amber', iconColor: 'text-amber', pulse: true },
    { icon: CheckCircle, label: 'Verificadas', value: formatNumber(stats.verified), color: 'text-green', iconColor: 'text-green' },
    { icon: MapPin, label: 'Zonas activas', value: String(stats.activeZones), color: 'text-blue-400', iconColor: 'text-blue-400' },
  ]

  return (
    <section className="border-y border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 px-6 py-5">
            <span className={`${item.iconColor} ${item.pulse ? 'animate-pulse' : ''}`}>
              <item.icon className="w-5 h-5" />
            </span>
            <div>
              <p className={`font-heading font-bold text-2xl leading-none ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted mt-1">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
