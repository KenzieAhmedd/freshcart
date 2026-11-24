import { Loader2 } from "lucide-react";
import { cn } from "@/utils/format";

export default function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin", className)} aria-label="Loading" />;
}

export function PageSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-gray-500">
      <Spinner className="h-8 w-8 text-primary-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
