// app/dashboard/admin/users/loading.tsx
import Spinner from "@/components/Spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="space-y-4">
      <Spinner />
    </div>
  );
}
