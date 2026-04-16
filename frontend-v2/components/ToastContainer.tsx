"use client";

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { ToastData } from "@/lib/types";

interface ToastProps {
  toast: ToastData;
  onRemove: (id: string) => void;
}

const meta = {
  success: { icon: CheckCircle, color: "text-green", bg: "border-green/20 bg-green/5" },
  error: { icon: AlertCircle, color: "text-primary", bg: "border-primary/20 bg-primary/5" },
  info: { icon: Info, color: "text-blue-400", bg: "border-blue-400/20 bg-blue-400/5" },
  warning: { icon: AlertTriangle, color: "text-amber", bg: "border-amber/20 bg-amber/5" },
};

function Toast({ toast, onRemove }: ToastProps) {
  const m = meta[toast.type];
  return (
    <div className={`flex items-start gap-3 w-80 p-4 rounded-xl border ${m.bg} bg-surface shadow-xl animate-slide-up`}>
      <m.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${m.color}`} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm">{toast.title}</p>
        {toast.message && <p className="text-xs text-foreground-2 mt-0.5">{toast.message}</p>}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-muted hover:text-foreground transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-4 z-[60] flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}
