"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore } from "@/store/toast.store";
import { cn } from "@/utils/format";

const ICONS = { success: CheckCircle2, error: XCircle, info: Info } as const;
const TONES = {
  success: "border-primary-200 text-primary-800",
  error: "border-red-200 text-red-700",
  info: "border-gray-200 text-gray-700",
} as const;

export default function Toaster() {
  const { toasts, dismiss } = useToastStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6" aria-live="polite">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div key={t.id} role="status" className={cn("pointer-events-auto flex w-full max-w-sm animate-slideIn items-start gap-3 rounded-xl border bg-white p-3.5 shadow-lg", TONES[t.type])}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-gray-400 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
