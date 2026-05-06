import { AlertTriangle, Search, CarFront, UserRoundSearch, ShieldAlert, ArrowRight } from 'lucide-react'
import type { PersistedReport } from '../hooks/use-reports'
import type { SearchMode } from '../lib/ui-types'

interface HeroProps {
  onDenunciar: () => void
  todayCount: number
  search: string
  mode: SearchMode
  onSearchChange: (value: string) => void
  onModeChange: (value: SearchMode) => void
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
  search,
  mode,
  onSearchChange,
  onModeChange,
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
          Busca primero.{' '}
          <span className="text-primary">Reporta con responsabilidad.</span>
        </h1>

        <p className="text-foreground-2 text-lg sm:text-xl max-w-3xl mx-auto mb-8">
          Consulta patentes, RUT o nombres en segundos y comparte reportes para fortalecer la seguridad ciudadana sin afirmar culpabilidad como hecho.
        </p>

        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-surface/90 backdrop-blur-sm p-4 sm:p-5 mb-7 shadow-xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => onModeChange('vehicle')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === 'vehicle' ? 'bg-primary text-white' : 'bg-surface-2 text-foreground-2 hover:text-foreground'
              }`}
            >
              <CarFront className="w-4 h-4" /> Buscar patente
            </button>
            <button
              onClick={() => onModeChange('scam')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === 'scam' ? 'bg-primary text-white' : 'bg-surface-2 text-foreground-2 hover:text-foreground'
              }`}
            >
              <UserRoundSearch className="w-4 h-4" /> Buscar RUT
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={mode === 'vehicle' ? 'Ingresa patente (ej: BBDF32)' : 'Ingresa RUT (ej: 123456789)'}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border border-border text-base text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="mt-3 text-left">
            {search.trim() === '' ? (
              <p className="text-xs text-muted">Busca por patente o RUT para validar si ya existe una denuncia.</p>
            ) : searchMatches.length > 0 ? (
              <div className="rounded-xl border border-green/30 bg-green/10 p-3 space-y-3">
                <p className="text-xs text-green mb-1">{searchMatches.length} registro(s) encontrado(s)</p>
                {searchMatches.map((match) => (
                  <article key={match.id} className="rounded-lg border border-green/20 bg-black/10 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-green/80">Patente</p>
                        <p className="text-foreground font-medium">{match.licensePlate}</p>
                      </div>
                      <div>
                        <p className="text-green/80">Fecha</p>
                        <p className="text-foreground">{new Date(match.date).toLocaleString()}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-green/80">Descripción</p>
                        <p className="text-foreground">{match.description}</p>
                      </div>
                      <div>
                        <p className="text-green/80">Ubicación</p>
                        <p className="text-foreground">{match.location}</p>
                      </div>
                      <div>
                        <p className="text-green/80">Contacto</p>
                        <p className="text-foreground">{match.contact}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-green/80">ID</p>
                        <p className="text-foreground break-all">{match.id}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-amber/30 bg-amber/10 p-3">
                <p className="text-xs text-amber mb-1">Sin coincidencias</p>
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
          <a
            href="#reports"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-foreground-2 text-foreground-2 hover:text-foreground text-base transition-all"
          >
            Ver reportes publicados
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
