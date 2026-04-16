"use client";

import { useState } from "react";
import { X, AlertTriangle, ChevronRight, Check, Loader2 } from "lucide-react";
import type { ReportFormData, Category } from "@/lib/types";
import { CATEGORIES, REGIONS } from "@/lib/mock-data";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ReportFormData, never>) => void;
}

const EMPTY: ReportFormData = {
  title: "",
  description: "",
  category: "robo",
  location: "",
  region: "Región Metropolitana",
  evidence: "",
  isAnonymous: false,
};

const STEPS = ["Categoría", "Detalles", "Confirmar"];

export default function ReportModal({ open, onClose, onSubmit }: ReportModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ReportFormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  function set<K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose() {
    onClose();
    setTimeout(() => { setStep(0); setForm(EMPTY); setDone(false); }, 300);
  }

  async function handleSubmit() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    onSubmit(form);
    setLoading(false);
    setDone(true);
  }

  const canNext =
    step === 0
      ? !!form.category
      : step === 1
      ? form.title.trim().length >= 10 && form.description.trim().length >= 20 && form.location.trim().length >= 3
      : true;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <span className="font-heading font-semibold text-foreground">Nueva denuncia</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress */}
        {!done && (
          <div className="px-6 pt-4">
            <div className="flex items-center gap-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
                    i < step ? "bg-primary text-white" : i === step ? "border-2 border-primary text-primary" : "border border-border text-muted"
                  }`}>
                    {i < step ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={`text-xs ${i === step ? "text-foreground" : "text-muted"}`}>{label}</span>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">
          {done ? (
            <div className="text-center py-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green/10 mx-auto mb-4">
                <Check className="w-7 h-7 text-green" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">¡Denuncia enviada!</h3>
              <p className="text-sm text-foreground-2">
                Tu reporte fue publicado y estará visible una vez revisado por la comunidad.
              </p>
            </div>
          ) : step === 0 ? (
            <div>
              <p className="text-sm text-foreground-2 mb-4">¿Qué tipo de situación quieres denunciar?</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => set("category", cat.value as Category)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-left text-sm font-medium border transition-all ${
                      form.category === cat.value
                        ? `${cat.color} border-current`
                        : "border-border text-foreground-2 hover:border-foreground-2 hover:text-foreground bg-surface-2"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current flex-shrink-0" />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs text-foreground-2 mb-1.5">Título <span className="text-primary">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Ej: Estafa en Instagram — cuenta @..."
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground-2 mb-1.5">Descripción <span className="text-primary">*</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe con el mayor detalle posible lo que ocurrió..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground-2 mb-1.5">Ubicación <span className="text-primary">*</span></label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Calle, sector, plataforma..."
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-foreground-2 mb-1.5">Región</label>
                  <select
                    value={form.region}
                    onChange={(e) => set("region", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all"
                  >
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-foreground-2 mb-1.5">Evidencia (URL imagen o captura, opcional)</label>
                <input
                  type="url"
                  value={form.evidence}
                  onChange={(e) => set("evidence", e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.isAnonymous}
                  onChange={(e) => set("isAnonymous", e.target.checked)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <span className="text-sm text-foreground-2">Publicar de forma anónima</span>
              </label>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-foreground-2">Revisa los datos antes de publicar:</p>
              <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-2 text-sm">
                <Row label="Categoría" value={CATEGORIES.find(c => c.value === form.category)?.label ?? form.category} />
                <Row label="Título" value={form.title} />
                <Row label="Ubicación" value={`${form.location} — ${form.region}`} />
                <Row label="Anónimo" value={form.isAnonymous ? "Sí" : "No"} />
              </div>
              <p className="text-xs text-muted">
                Al publicar aceptas que el contenido es verídico y no contiene datos sensibles de terceros sin su consentimiento.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!done ? (
          <div className="px-6 pb-5 flex items-center justify-between gap-3">
            <button
              onClick={() => step > 0 ? setStep(s => s - 1) : handleClose()}
              className="px-4 py-2 rounded-lg border border-border text-foreground-2 hover:text-foreground hover:border-foreground-2 text-sm transition-all"
            >
              {step === 0 ? "Cancelar" : "Atrás"}
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all active:scale-95"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-medium transition-all active:scale-95"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {loading ? "Publicando..." : "Publicar denuncia"}
              </button>
            )}
          </div>
        ) : (
          <div className="px-6 pb-5">
            <button
              onClick={handleClose}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-2 border border-border text-foreground-2 hover:text-foreground text-sm transition-all"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted">{label}</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  );
}
