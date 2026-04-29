import { useState, useEffect } from 'react'
import { Shield, Menu, X, AlertTriangle } from 'lucide-react'

interface NavbarProps {
  onDenunciar: () => void
}

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Denuncias', href: '#feed' },
  { label: 'Cómo funciona', href: '#como-funciona' },
]

export default function Navbar({ onDenunciar }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <a href="#inicio" className="flex items-center gap-2.5 group">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary group-hover:bg-primary-hover transition-colors">
            <Shield className="w-4 h-4 text-white" />
          </span>
          <span className="font-heading font-bold text-foreground text-lg tracking-tight">
            Alerta<span className="text-primary">Ciudadana</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-2 text-sm text-foreground-2 hover:text-foreground rounded-lg hover:bg-surface-2 transition-all"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onDenunciar}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all active:scale-95"
          >
            <AlertTriangle className="w-4 h-4" />
            Denunciar
          </button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-foreground-2 hover:text-foreground hover:bg-surface-2 transition-all"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-slide-down px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm text-foreground-2 hover:text-foreground rounded-lg hover:bg-surface-2 transition-all"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            onClick={() => { setOpen(false); onDenunciar() }}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all"
          >
            <AlertTriangle className="w-4 h-4" />
            Denunciar ahora
          </button>
        </div>
      )}
    </header>
  )
}
