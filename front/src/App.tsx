import { useState } from 'react'
import NavbarNew from './components/NavbarNew'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import Filters from './components/Filters'
import ReportCard from './components/ReportCard'
import Sidebar from './components/Sidebar'
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
    vehicleReports,
    scamReports,
    instantResult,
    searchMode,
    setSearchMode,
    filter,
    setFilter,
    search,
    setSearch,
    vote,
    addReport,
    stats,
    zones,
    topAccounts,
    loading,
    error,
  } = useReports()
  const { toasts, addToast, removeToast } = useToast()

  function handleSubmit(data: ReportFormData) {
    const isVehicle = data.mode === 'vehicle'
    const title = data.title.trim() || (isVehicle ? `Vehiculo reportado ${data.plate}` : `Estafa reportada ${data.rut}`)
    const location = data.location.trim() || (isVehicle ? `Patente ${data.plate}` : `RUT ${data.rut}`)
    const evidence = [data.evidence, ...data.evidenceLinks.split(',').map((v) => v.trim())].filter(Boolean)

    addReport({
      title,
      description: data.description,
      category: isVehicle ? 'vehiculo_robado' : 'estafa',
      location,
      region: data.region,
      isAnonymous: data.isAnonymous,
      evidence,
      plate: isVehicle ? data.plate : undefined,
      brand: isVehicle ? data.brand : undefined,
      model: isVehicle ? data.model : undefined,
      color: isVehicle ? data.color : undefined,
      year: isVehicle ? data.year : undefined,
      chassisNumber: isVehicle ? data.chassisNumber : undefined,
      scamPersonName: !isVehicle ? data.personName : undefined,
      scamRut: !isVehicle ? data.rut : undefined,
      scamAlias: !isVehicle ? data.alias : undefined,
      scamType: !isVehicle ? data.scamType : undefined,
      verificationState: 'unverified',
      flagsCount: 0,
    })
    addToast({ type: 'success', title: 'Denuncia enviada', message: 'Tu reporte fue publicado y está en revisión.' })
  }

  return (
    <>
      <NavbarNew onDenunciar={() => setModalOpen(true)} />
      <main>
        <Hero
          onDenunciar={() => setModalOpen(true)}
          todayCount={stats.today}
          search={search}
          mode={searchMode}
          onSearchChange={setSearch}
          onModeChange={setSearchMode}
          instantResult={instantResult}
        />
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
              { step: '02', title: 'La comunidad vota', desc: 'Otros usuarios verifican y respaldan tu denuncia con votos.' },
              { step: '03', title: 'Se genera alerta pública', desc: 'Las denuncias verificadas aparecen en el feed y el mapa de zonas activas.' },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:bg-surface-2 transition-all">
                <span className="font-heading font-bold text-5xl text-white leading-none select-none">{item.step}</span>
                <h3 className="font-heading font-semibold text-foreground text-lg mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-foreground-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="feed" className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">Buscador y feed comunitario</h2>
            <span className="text-sm text-muted">{reports.length} resultados</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            <div className="flex flex-col gap-5">
              <Filters filter={filter} search={search} onFilterChange={setFilter} onSearchChange={setSearch} />
              {loading && (
                <div className="rounded-xl border border-border bg-surface p-4 text-sm text-foreground-2">
                  Cargando denuncias reales...
                </div>
              )}
              {!loading && error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}
              {reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-foreground-2 text-sm">No encontrado. Puedes crear una denuncia nueva ahora.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-semibold text-foreground">Vehiculos robados</h3>
                      <span className="text-xs text-muted">{vehicleReports.length} registros</span>
                    </div>
                    {vehicleReports.length === 0 ? (
                      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-foreground-2">
                        Sin registros de vehiculos para este filtro.
                      </div>
                    ) : (
                      vehicleReports.map((r) => <ReportCard key={r.id} report={r} onVote={vote} />)
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-semibold text-foreground">Estafas reportadas</h3>
                      <span className="text-xs text-muted">{scamReports.length} registros</span>
                    </div>
                    {scamReports.length === 0 ? (
                      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-foreground-2">
                        Sin registros de estafas para este filtro.
                      </div>
                    ) : (
                      scamReports.map((r) => <ReportCard key={r.id} report={r} onVote={vote} />)
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Sidebar zones={zones} accounts={topAccounts} onDenunciar={() => setModalOpen(true)} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterNew />
      <ReportModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
