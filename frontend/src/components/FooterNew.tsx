import { Shield, Code2, Send } from 'lucide-react'

const cols = [
  { title: 'Plataforma', links: ['Inicio', 'Ver denuncias', 'Hacer denuncia', 'Cómo funciona'] },
  { title: 'Legal', links: ['Términos de uso', 'Privacidad', 'Denuncia responsable'] },
  { title: 'Comunidad', links: ['Discord', 'Telegram de alertas', 'Contribuir', 'Reportar error'] },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
                <Shield className="w-3.5 h-3.5 text-white" />
              </span>
              <span className="font-heading font-bold text-foreground">
                Alerta<span className="text-primary">Ciudadana</span>
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Plataforma ciudadana de denuncia colectiva. Transparente, anónima y gratuita.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <a href="#" className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground-2 transition-all">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground-2 transition-all">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h6 className="font-heading font-semibold text-foreground text-sm mb-3">{col.title}</h6>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted hover:text-foreground-2 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
          <span>© 2026 AlertaCiudadana. Todos los derechos reservados.</span>
          <span>Hecho con ❤️ para Chile</span>
        </div>
      </div>
    </footer>
  )
}
