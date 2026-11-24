import { SearchX } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function NotFound() {
  return <div className="container-fc py-16"><EmptyState icon={SearchX} title="Page not found" description="The page you're looking for doesn't exist or has moved." actionLabel="Back to home" actionHref="/" /></div>;
}
