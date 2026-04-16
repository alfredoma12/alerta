import { ChevronUp, ChevronDown, MapPin, Clock, CheckCircle, AlertCircle, Shield } from 'lucide-react'
import type { Report } from '../lib/ui-types'
import { getCategoryMeta, timeAgo } from '../lib/ui-utils'

interface ReportCardProps {
  report: Report
  onVote: (id: string, direction: 'up' | 'down') => void
}

const statusMeta = {
  verified: { icon: CheckCircle, label: 'Verificado', color: 'text-green' },
  pending: { icon: AlertCircle, label: 'Pendiente', color: 'text-amber' },
  rejected: { icon: Shield, label: 'Rechazado', color: 'text-muted' },
}

export default function ReportCard({ report, onVote }: ReportCardProps) {
  const cat = getCategoryMeta(report.category)
  const status = statusMeta[report.status]

  return (
    <article className="group flex gap-4 p-4 rounded-xl border border-border bg-surface hover:bg-surface-2 transition-all duration-200">
      <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
        <button
          onClick={() => onVote(report.id, 'up')}
          className={`p-1 rounded-md transition-all active:scale-90 ${
            report.userVote === 'up' ? 'bg-primary/20 text-primary' : 'text-muted hover:text-primary hover:bg-primary/10'
          }`}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <span
          className={`font-heading font-bold text-sm leading-none min-w-[2ch] text-center ${
            report.userVote === 'up' ? 'text-primary' : report.userVote === 'down' ? 'text-red-400' : 'text-foreground'
          }`}
        >
          {report.votes}
        </span>
        <button
          onClick={() => onVote(report.id, 'down')}
          className={`p-1 rounded-md transition-all active:scale-90 ${
            report.userVote === 'down' ? 'bg-red-500/20 text-red-400' : 'text-muted hover:text-red-400 hover:bg-red-500/10'
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cat.color}`}>
            {cat.label}
          </span>
          <span className={`inline-flex items-center gap-1 text-xs ${status.color}`}>
            <status.icon className="w-3 h-3" />
            {status.label}
          </span>
        </div>

        <h3 className="font-heading font-semibold text-foreground text-base leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2">
          {report.title}
        </h3>

        <p className="text-sm text-foreground-2 leading-relaxed line-clamp-2 mb-3">{report.description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{report.location}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(report.createdAt)}</span>
          <span>{report.isAnonymous ? 'Anónimo' : `por ${report.author}`}</span>
        </div>
      </div>
    </article>
  )
}
