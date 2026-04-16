import { Search, X } from 'lucide-react'
import { CATEGORIES } from '../lib/mock-data'

interface FiltersProps {
  filter: string
  search: string
  onFilterChange: (value: string) => void
  onSearchChange: (value: string) => void
}

export default function Filters({ filter, search, onFilterChange, onSearchChange }: FiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título, descripción o lugar..."
          className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
        />
        {search && (
          <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filter === 'all' ? 'bg-primary text-white' : 'bg-surface border border-border text-foreground-2 hover:border-foreground-2 hover:text-foreground'
          }`}
        >
          Todas
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onFilterChange(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === cat.value ? `${cat.color} border border-current` : 'bg-surface border border-border text-foreground-2 hover:border-foreground-2 hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
