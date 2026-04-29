import { useState } from 'react'
import { X, AlertTriangle, ChevronRight, Check, Loader2 } from 'lucide-react'
import type { ReportFormData, SearchMode } from '../lib/ui-types'
import { CATEGORIES, REGIONS } from '../lib/mock-data'

interface ReportModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: ReportFormData) => void
}

const EMPTY: ReportFormData = {
  mode: 'vehicle',
  plate: '',
  brand: '',
  model: '',
  color: '',
  year: '',
  chassisNumber: '',
  theftDate: '',
  reward: '',
  personName: '',
  rut: '',
  alias: '',
  scamType: '',
  title: '',
  description: '',
  category: 'robo',
  location: '',
  region: 'Región Metropolitana',
  evidence: '',
  evidenceLinks: '',
  isAnonymous: false,
}

const STEPS = ['Tipo', 'Detalles', 'Confirmar']

export default function ReportModal({ open, onClose, onSubmit }: ReportModalProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<ReportFormData>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (!open) return null

  function set<K extends keyof ReportFormData>(key: K, value: ReportFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleClose() {
    onClose()
    setTimeout(() => { setStep(0); setForm(EMPTY); setDone(false) }, 300)
  }

  async function handleSubmit() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    onSubmit(form)
    setLoading(false)
    setDone(true)
  }

  const canNext =
    step === 0 ? !!form.mode
    : step === 1
      ? form.mode === 'vehicle'
        ? form.plate.trim().length >= 5 && form.brand.trim().length >= 2 && form.model.trim().length >= 2 && form.location.trim().length >= 3 && form.description.trim().length >= 20
        : form.personName.trim().length >= 6 && form.rut.trim().length >= 8 && form.scamType.trim().length >= 4 && form.description.trim().length >= 20
    : true

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <span className="font-heading font-semibold text-foreground">Nueva denuncia</span>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-2 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!done && (
          <div className="px-6 pt-4">
            <div className="flex items-center gap-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all ${
                    i < step ? 'bg-primary text-white' : i === step ? 'border-2 border-primary text-primary' : 'border border-border text-muted'
                  }`}>
                    {i < step ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={`text-xs ${i === step ? 'text-foreground' : 'text-muted'}`}>{label}</span>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 py-5">
          {done ? (
            <div className="text-center py-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green/10 mx-auto mb-4">
                <Check className="w-7 h-7 text-green" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">¡Denuncia enviada!</h3>
              <p className="text-sm text-foreground-2">Tu reporte fue publicado y estará visible una vez revisado.</p>
            </div>
          ) : step === 0 ? (
            <div>
              <p className="text-sm text-foreground-2 mb-4">Selecciona el modulo de denuncia:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'vehicle', label: 'Vehiculo robado', desc: 'Patente, marca, modelo y ubicacion del robo' },
                  { value: 'scam', label: 'Estafa a persona', desc: 'Nombre, RUT, alias y tipo de estafa' },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      const mode = item.value as SearchMode
                      set('mode', mode)
                      set('category', mode === 'vehicle' ? 'vehiculo_robado' : 'estafa')
                    }}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      form.mode === item.value ? 'border-primary bg-primary/10' : 'border-border text-foreground-2 hover:border-foreground-2 bg-surface-2'
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col gap-3">
              {form.mode === 'vehicle' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Patente <span className="text-primary">*</span></label>
                      <input type="text" value={form.plate} onChange={(e) => set('plate', e.target.value.toUpperCase())}
                        placeholder="Ej: BBDF32"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Ano</label>
                      <input type="text" value={form.year} onChange={(e) => set('year', e.target.value)}
                        placeholder="Ej: 2019"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Marca <span className="text-primary">*</span></label>
                      <input type="text" value={form.brand} onChange={(e) => set('brand', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Modelo <span className="text-primary">*</span></label>
                      <input type="text" value={form.model} onChange={(e) => set('model', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Color</label>
                      <input type="text" value={form.color} onChange={(e) => set('color', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Ubicacion del robo <span className="text-primary">*</span></label>
                      <input type="text" value={form.location} onChange={(e) => set('location', e.target.value)}
                        placeholder="Comuna, calle o referencia"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Fecha del robo</label>
                      <input type="date" value={form.theftDate} onChange={(e) => set('theftDate', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">N de chasis (opcional)</label>
                      <input type="text" value={form.chassisNumber} onChange={(e) => set('chassisNumber', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Recompensa (opcional)</label>
                      <input type="text" value={form.reward} onChange={(e) => set('reward', e.target.value)}
                        placeholder="Ej: $300.000"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-foreground-2 mb-1.5">Descripcion detallada <span className="text-primary">*</span></label>
                    <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                      placeholder="Indica contexto, caracteristicas distintivas y fuentes de verificacion..." rows={3}
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Nombre completo <span className="text-primary">*</span></label>
                      <input type="text" value={form.personName} onChange={(e) => set('personName', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">RUT <span className="text-primary">*</span></label>
                      <input type="text" value={form.rut} onChange={(e) => set('rut', e.target.value)}
                        placeholder="Ej: 12.345.678-9"
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Alias / username (opcional)</label>
                      <input type="text" value={form.alias} onChange={(e) => set('alias', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-foreground-2 mb-1.5">Tipo de estafa <span className="text-primary">*</span></label>
                      <input type="text" value={form.scamType} onChange={(e) => set('scamType', e.target.value)}
                        placeholder="Marketplace, transferencia, inversion..."
                        className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-foreground-2 mb-1.5">Descripcion <span className="text-primary">*</span></label>
                    <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                      placeholder="Describe hechos reportados sin afirmar culpabilidad como sentencia..." rows={3}
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-foreground-2 mb-1.5">Evidencia (imagenes o links)</label>
                    <input type="text" value={form.evidenceLinks} onChange={(e) => set('evidenceLinks', e.target.value)}
                      placeholder="URL separadas por coma"
                      className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs text-foreground-2 mb-1.5">Titulo publico <span className="text-primary">*</span></label>
                <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)}
                  placeholder="Resumen breve y neutral del reporte"
                  className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-foreground-2 mb-1.5">Region</label>
                  <select value={form.region} onChange={(e) => set('region', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all">
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-foreground-2 mb-1.5">Evidencia principal (URL opcional)</label>
                  <input type="url" value={form.evidence} onChange={(e) => set('evidence', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-2 border border-border text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all" />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={form.isAnonymous} onChange={(e) => set('isAnonymous', e.target.checked)}
                  className="w-4 h-4 rounded accent-primary" />
                <span className="text-sm text-foreground-2">Publicar de forma anónima</span>
              </label>
              <p className="text-xs text-muted">Contenido generado por usuarios. Informacion no verificada.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-foreground-2">Revisa los datos antes de publicar:</p>
              <div className="rounded-xl border border-border bg-surface-2 p-4 space-y-2 text-sm">
                {[
                  ['Modulo', form.mode === 'vehicle' ? 'Vehiculo robado' : 'Estafa a persona'],
                  ['Categoría', CATEGORIES.find(c => c.value === form.category)?.label ?? form.category],
                  ['Título', form.title],
                  ['Ubicacion', `${form.location || 'No informada'} - ${form.region}`],
                  ['Anónimo', form.isAnonymous ? 'Sí' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="text-muted">{label}</span>
                    <span className="text-foreground text-right">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted">Al publicar declaras buena fe y aceptas lenguaje neutral para evitar difamacion.</p>
            </div>
          )}
        </div>

        {!done ? (
          <div className="px-6 pb-5 flex items-center justify-between gap-3">
            <button onClick={() => step > 0 ? setStep(s => s - 1) : handleClose()}
              className="px-4 py-2 rounded-lg border border-border text-foreground-2 hover:text-foreground hover:border-foreground-2 text-sm transition-all">
              {step === 0 ? 'Cancelar' : 'Atrás'}
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all active:scale-95">
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-sm font-medium transition-all active:scale-95">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {loading ? 'Publicando...' : 'Publicar denuncia'}
              </button>
            )}
          </div>
        ) : (
          <div className="px-6 pb-5">
            <button onClick={handleClose}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-2 border border-border text-foreground-2 hover:text-foreground text-sm transition-all">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
