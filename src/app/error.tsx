"use client";

import { ErrorState } from "@/components/ui/EmptyState";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <div className="container-fc py-16"><ErrorState message={error.message || "Something went wrong."} onRetry={reset} /></div>;
}
