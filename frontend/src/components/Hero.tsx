import { AlertTriangle, Eye, UserX, ArrowRight } from 'lucide-react'

interface HeroProps {
  onDenunciar: () => void
  todayCount: number
}

const features = [
  { icon: Eye, text: 'Denuncias verificadas por la comunidad' },
  { icon: UserX, text: 'Publicación anónima disponible' },
  { icon: AlertTriangle, text: 'Alertas en tiempo real por zona' },
]

export default function Hero({ onDenunciar, todayCount }: HeroProps) {
  return (
    <section id="inicio" className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Plataforma activa — {todayCount} nuevas denuncias hoy
        </div>

        <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-6">
          Protege a tu comunidad.{' '}
          <span className="text-primary">Denuncia ahora.</span>
        </h1>

        <p className="text-foreground-2 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          La plataforma ciudadana para reportar robos, estafas, fraudes digitales y vehículos
          robados. Colectiva, verificada y anónima.
        </p>

        <ul className="flex flex-wrap justify-center gap-3 mb-10">
          {features.map((f) => (
            <li
              key={f.text}
              className="flex items-center gap-1.5 text-sm text-foreground-2 bg-surface border border-border rounded-full px-3 py-1.5"
            >
              <f.icon className="w-3.5 h-3.5 text-primary" />
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
            Hacer una denuncia
          </button>
          <a
            href="#feed"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:border-foreground-2 text-foreground-2 hover:text-foreground text-base transition-all"
          >
            Ver denuncias
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
