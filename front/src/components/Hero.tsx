import { AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react'

interface HeroProps {
  onDenunciar: () => void
  todayCount: number
}

const features = [
  { text: 'Contenido generado por usuarios' },
  { text: 'Informacion no verificada' },
  { text: 'Esta plataforma no reemplaza denuncias oficiales' },
]

export default function Hero({ onDenunciar, todayCount }: HeroProps) {
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

        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-surface/90 backdrop-blur-sm p-5 mb-7 shadow-xl text-left">
          <h3 className="font-heading font-semibold text-foreground text-lg mb-2">Publicación directa sin revisión manual</h3>
          <p className="text-sm text-foreground-2">
            Cada denuncia se guarda inmediatamente en SQLite y aparece de forma automática en el listado principal.
          </p>
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
