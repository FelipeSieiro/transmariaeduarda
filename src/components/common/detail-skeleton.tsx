import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DetailSkeletonProps {
  className?: string;
  bodyHeight?: string;
}

// Placeholder das telas de detalhe/formulário enquanto os dados carregam.
export function DetailSkeleton({
  className = "mx-auto max-w-4xl",
  bodyHeight = "h-48",
}: DetailSkeletonProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <Skeleton className="h-10 w-48 rounded-xl" />
      <Skeleton className={cn("rounded-xl", bodyHeight)} />
    </div>
  );
}
