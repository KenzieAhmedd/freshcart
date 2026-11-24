import { Star } from "lucide-react";

export default function Rating({ value, count, size = "sm" }: { value: number; count?: number; size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1 text-sm text-gray-600" aria-label={`Rated ${value} out of 5`}>
      <Star className={`${dim} fill-amber-400 text-amber-400`} />
      <span className="font-medium text-gray-800">{value || 0}</span>
      {count !== undefined && <span className="text-gray-500">({count})</span>}
    </div>
  );
}
