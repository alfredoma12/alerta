import { AlertTriangle, Search, CarFront, ShieldAlert } from 'lucide-react'
import type { PersistedReport } from '../hooks/use-reports'

interface HeroProps {
  onDenunciar: () => void
  todayCount: number
  searchInput: string
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  searchMatches: PersistedReport[]
}

const features = [
  { text: 'Contenido generado por usuarios' },
  { text: 'Informacion no verificada' },
  { text: 'Esta plataforma no reemplaza denuncias oficiales' },
]

export default function Hero({
  onDenunciar,
  todayCount,
  searchInput,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  searchMatches,
}: HeroProps) {
  return (
    <section id="inicio" className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-16 right-0 w-[340px] h-[340px] bg-amber/10 rounded-full blur-[90px]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Plataforma activa - {todayCount} nuevas denuncias hoy
        </div>

        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6">
          Plataforma ciudadana de{' '}
          <span className="text-primary">vehiculos robados.</span>
        </h1>

        <p className="text-foreground-2 text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Busca por patente para verificar si un vehiculo fue reportado por robo y publica tu denuncia para alertar a la comunidad.
        </p>

        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-surface/90 backdrop-blur-sm p-4 sm:p-5 mb-7 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 text-foreground-2 text-sm mb-3">
            <CarFront className="w-4 h-4" /> Búsqueda por patente
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearchSubmit()
              }}
              placeholder="Ingresa patente (ej: BBDF32)"
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-border text-base text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <button
            onClick={onSearchSubmit}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all"
          >
            Buscar
          </button>

          <div className="mt-3 text-left">
            {searchQuery.trim() === '' ? (
              <p className="text-xs text-muted">Ingresa una patente y presiona Buscar para ver resultados.</p>
            ) : searchMatches.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wide">
                    ⚠ Vehículo reportado por robo
                  </span>
                  <span className="text-xs text-muted">{searchMatches.length} reporte(s) encontrado(s)</span>
                </div>
                {searchMatches.map((match) => (
                  <article key={match.id} className="rounded-2xl border border-red-500/25 bg-red-500/5 p-5 sm:p-6 text-left">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Patente</p>
                        <p className="font-heading font-bold text-3xl sm:text-4xl text-foreground tracking-wider">{match.licensePlate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Fecha del reporte</p>
                        <p className="text-sm text-foreground">{new Date(match.date).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                        <p className="text-xs text-muted">{new Date(match.date).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Descripción</p>
                        <p className="text-base text-foreground leading-relaxed">{match.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Ubicación del robo</p>
                        <p className="text-sm text-foreground">{match.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted uppercase tracking-widest mb-1">Contacto</p>
                        <p className="text-sm text-foreground">{match.contact}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-amber/30 bg-amber/10 p-3">
                <p className="text-xs text-amber mb-1">No hay reportes de robo para esa patente</p>
                <button onClick={onDenunciar} className="text-sm text-foreground underline underline-offset-4 hover:text-white transition-colors">
                  Crear denuncia ahora
                </button>
              </div>
            )}
          </div>
        </div>

        <ul className="flex flex-wrap justify-center gap-3 mb-8">
          {features.map((f) => (
            <li
              key={f.text}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-foreground-2 bg-surface border border-border rounded-full px-3 py-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-primary" />
              {f.text}
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onDenunciar}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium text-base transition-all active:scale-95 shadow-lg shadow-primary/20"
          >
            <AlertTriangle className="w-5 h-5" />
            Crear denuncia
          </button>
        </div>
      </div>
    </section>
  )
}
