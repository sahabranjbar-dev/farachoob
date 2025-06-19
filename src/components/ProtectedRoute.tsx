"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

interface ProtectedRouteProps {
  allowedRoles?: string[]; // مثلا ['ADMIN', 'USER']
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles = [],
  children,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    } else if (
      status === "authenticated" &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(session?.user?.role)
    ) {
      router.replace("/unauthorized");
    }
  }, [status, session, allowedRoles, router]);

  if (status === "loading") {
    return <Skeleton className="h-[20px] w-[100px] rounded-full" />;
  }

  return <>{children}</>;
}
