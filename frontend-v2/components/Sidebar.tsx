import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import type { Zone, TopAccount } from "@/lib/types";

interface SidebarProps {
  zones: Zone[];
  accounts: TopAccount[];
  onDenunciar: () => void;
}

const platformColor: Record<string, string> = {
  instagram: "text-pink-400",
  facebook: "text-blue-400",
  tiktok: "text-foreground",
  twitter: "text-sky-400",
  whatsapp: "text-green",
};

const TrendIcon = ({ trend }: { trend: Zone["trend"] }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-primary" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-green" />;
  return <Minus className="w-3.5 h-3.5 text-muted" />;
};

export default function Sidebar({ zones, accounts, onDenunciar }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      {/* Zones */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-3">
          🔥 Zonas más activas
        </h3>
        <ul className="space-y-2.5">
          {zones.map((zone) => (
            <li key={zone.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">{zone.name}</p>
                <p className="text-xs text-muted">{zone.region}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground-2">{zone.count}</span>
                <TrendIcon trend={zone.trend} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Top accounts */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-3">
          ⚠️ Más denunciados
        </h3>
        <ul className="space-y-2.5">
          {accounts.map((acc) => (
            <li key={acc.handle} className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${platformColor[acc.platform] ?? "text-foreground-2"}`}>
                  {acc.handle}
                </p>
                <p className="text-xs text-muted capitalize">{acc.platform}</p>
              </div>
              <span className="flex-shrink-0 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {acc.reports}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA anónima */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-1.5">
          Denuncia sin exponer tu identidad
        </h3>
        <p className="text-xs text-foreground-2 mb-3">
          Puedes publicar de forma anónima. No guardamos tu IP ni datos personales.
        </p>
        <button
          onClick={onDenunciar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all active:scale-95"
        >
          <AlertTriangle className="w-4 h-4" />
          Denunciar en privado
        </button>
      </div>
    </aside>
  );
}
