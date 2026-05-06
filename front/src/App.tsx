import { useState } from 'react'
import NavbarNew from './components/NavbarNew'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import ReportModal from './components/ReportModal'
import ToastContainer from './components/ToastContainer'
import FooterNew from './components/FooterNew'
import { useReports } from './hooks/use-reports'
import { useToast } from './hooks/use-toast'
import type { ReportFormData } from './lib/ui-types'

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const {
    reports,
    submitReport,
    stats,
    loading,
    error,
  } = useReports()
  const { toasts, addToast, removeToast } = useToast()

  async function handleSubmit(data: ReportFormData) {
    try {
      await submitReport(data)
      addToast({ type: 'success', title: 'Denuncia enviada', message: 'Tu reporte fue publicado correctamente.' })
    } catch {
      addToast({ type: 'error', title: 'No se pudo publicar', message: 'Intenta nuevamente en unos segundos.' })
    }
  }

  return (
    <>
      <NavbarNew onDenunciar={() => setModalOpen(true)} />
      <main>
        <Hero onDenunciar={() => setModalOpen(true)} todayCount={stats.today} />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-xs sm:text-sm text-amber">
            Esta plataforma no reemplaza denuncias oficiales. Contenido generado por usuarios e informacion no verificada.
          </div>
        </section>
        <StatsBar stats={stats} />
        <section id="como-funciona" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-foreground text-center mb-10">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Reportas el incidente', desc: 'Completa el formulario con detalles de lo ocurrido. Puedes ser anónimo.' },
              { step: '02', title: 'Se guarda en SQLite', desc: 'La API guarda tu reporte de inmediato en la base de datos local.' },
              { step: '03', title: 'Aparece al instante', desc: 'El listado se actualiza con los datos reales sin flujos de aprobación.' },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:bg-surface-2 transition-all">
                <span className="font-heading font-bold text-5xl text-white leading-none select-none">{item.step}</span>
                <h3 className="font-heading font-semibold text-foreground text-lg mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-foreground-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="reports" className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">Reportes publicados</h2>
            <span className="text-sm text-muted">{reports.length} registros</span>
          </div>

          {loading && (
            <div className="rounded-xl border border-border bg-surface p-4 text-sm text-foreground-2">
              Cargando reportes...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && reports.length === 0 && (
            <div className="rounded-xl border border-border bg-surface p-6 text-sm text-foreground-2">
              No hay reportes todavía. Crea el primero con el botón "Crear denuncia".
            </div>
          )}

          {!loading && !error && reports.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {reports.map((report) => (
                <article key={report.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-sm">
                    <div>
                      <p className="text-muted text-xs">Patente</p>
                      <p className="text-foreground font-medium">{report.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs">Descripción</p>
                      <p className="text-foreground">{report.description}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs">Ubicación</p>
                      <p className="text-foreground">{report.location}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs">Contacto</p>
                      <p className="text-foreground">{report.contact}</p>
                    </div>
                    <div>
                      <p className="text-muted text-xs">Fecha</p>
                      <p className="text-foreground">{new Date(report.date).toLocaleString()}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <FooterNew />
      <ReportModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
