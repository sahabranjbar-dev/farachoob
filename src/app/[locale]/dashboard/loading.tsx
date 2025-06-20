// app/dashboard/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen">
      {/* Skeleton Sidebar */}
      <div className="w-64 bg-gray-200 p-4">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-8 w-2/3 mb-2" />
        <Skeleton className="h-8 w-2/3 mb-2" />
        <Skeleton className="h-8 w-2/3 mb-2" />
      </div>

      {/* Skeleton Main Content */}
      <div className="flex-1 p-4 space-y-4">
        <Skeleton className="h-12 w-1/4" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
