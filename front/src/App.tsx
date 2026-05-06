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
    searchInput,
    setSearchInput,
    searchQuery,
    runSearch,
    searchMatches,
    submitReport,
    stats,
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
        <Hero
          onDenunciar={() => setModalOpen(true)}
          todayCount={stats.today}
          searchInput={searchInput}
          searchQuery={searchQuery}
          onSearchChange={setSearchInput}
          onSearchSubmit={runSearch}
          searchMatches={searchMatches}
        />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="rounded-xl border border-amber/30 bg-amber/10 px-4 py-3 text-xs sm:text-sm text-amber">
            Esta plataforma no reemplaza denuncias oficiales. Contenido generado por usuarios e informacion no verificada.
          </div>
        </section>
        <StatsBar stats={stats} />
      </main>
      <FooterNew />
      <ReportModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
