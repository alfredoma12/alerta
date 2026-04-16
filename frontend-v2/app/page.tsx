"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Filters from "@/components/Filters";
import ReportCard from "@/components/ReportCard";
import Sidebar from "@/components/Sidebar";
import ReportModal from "@/components/ReportModal";
import ToastContainer from "@/components/ToastContainer";
import Footer from "@/components/Footer";
import { useReports } from "@/hooks/use-reports";
import { useToast } from "@/hooks/use-toast";
import { MOCK_STATS, MOCK_ZONES, MOCK_TOP_ACCOUNTS } from "@/lib/mock-data";
import type { ReportFormData } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const { reports, filter, setFilter, search, setSearch, vote, addReport } = useReports();
  const { toasts, addToast, removeToast } = useToast();

  function handleSubmit(data: ReportFormData) {
    addReport({
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      region: data.region,
      isAnonymous: data.isAnonymous,
      evidence: data.evidence ? [data.evidence] : [],
    });
    addToast({
      type: "success",
      title: "Denuncia publicada",
      message: "Tu reporte fue enviado y está en revisión.",
    });
  }

  return (
    <>
      <Navbar onDenunciar={() => setModalOpen(true)} />

      <main>
        <Hero onDenunciar={() => setModalOpen(true)} />
        <StatsBar stats={MOCK_STATS} />

        {/* How it works */}
        <section id="como-funciona" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-foreground text-center mb-10">
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Reportas el incidente",
                desc: "Completa el formulario con detalles de lo ocurrido. Puedes ser anónimo.",
              },
              {
                step: "02",
                title: "La comunidad vota",
                desc: "Otros usuarios verifican y respaldan tu denuncia con votos.",
              },
              {
                step: "03",
                title: "Se genera alerta pública",
                desc: "Las denuncias verificadas aparecen en el mapa y el feed principal.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl border border-border bg-surface hover:border-primary/30 hover:bg-surface-2 transition-all"
              >
                <span className="font-heading font-bold text-5xl text-border leading-none select-none">
                  {item.step}
                </span>
                <h3 className="font-heading font-semibold text-foreground text-lg mt-3 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feed + Sidebar */}
        <section id="feed" className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
              Denuncias recientes
            </h2>
            <span className="text-sm text-muted">{reports.length} resultados</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            {/* Left: filters + cards */}
            <div className="flex flex-col gap-5">
              <Filters
                filter={filter}
                search={search}
                onFilterChange={setFilter}
                onSearchChange={setSearch}
              />

              {reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="w-8 h-8 text-muted mb-3 animate-spin" />
                  <p className="text-foreground-2 text-sm">Sin resultados para el filtro actual.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {reports.map((r) => (
                    <ReportCard key={r.id} report={r} onVote={vote} />
                  ))}
                </div>
              )}
            </div>

            {/* Right: sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Sidebar
                  zones={MOCK_ZONES}
                  accounts={MOCK_TOP_ACCOUNTS}
                  onDenunciar={() => setModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <ReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
