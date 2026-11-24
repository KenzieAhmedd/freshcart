import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Icon className="h-8 w-8" />
      </span>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <h2 className="text-lg font-bold text-red-800">We couldn&apos;t load this</h2>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-5">
          Try again
        </button>
      )}
    </div>
  );
}
