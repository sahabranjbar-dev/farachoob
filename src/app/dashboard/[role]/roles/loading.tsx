// app/dashboard/admin/users/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function RolesLoading() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  );
}
