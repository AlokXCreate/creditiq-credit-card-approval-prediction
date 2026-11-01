import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        const isError = t.type === "error";

        return (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl p-4 backdrop-blur-xl border shadow-2xl flex items-start gap-3 transform transition-all duration-300 animate-float ${
              isSuccess
                ? "bg-slate-900/90 border-emerald-500/40 text-slate-100 shadow-emerald-500/10"
                : isError
                ? "bg-slate-900/90 border-rose-500/40 text-slate-100 shadow-rose-500/10"
                : "bg-slate-900/90 border-indigo-500/40 text-slate-100 shadow-indigo-500/10"
            }`}
          >
            {isSuccess && <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isError && <AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="size-5 text-indigo-400 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <h5 className="text-xs font-bold text-white tracking-wide">{t.title}</h5>
              {t.description && <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{t.description}</p>}
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="p-1 rounded text-slate-400 hover:text-white transition shrink-0"
            >
              <X className="size-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
