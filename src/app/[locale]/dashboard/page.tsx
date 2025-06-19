"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // اگر لاگین نکرده بود به صفحه لاگین هدایت کن
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>در حال بارگذاری...</div>;
  }

  if (!session) {
    return null; // یا می‌تونی لودینگ یا پیام بگذاری
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">داشبورد کاربر</h1>
      <p className="mb-6">سلام، {session.user?.name || session.user?.email}</p>

      <button
        onClick={() => signOut({ callbackUrl: "/auth/login" })}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        خروج
      </button>
    </div>
  );
};

export default DashboardPage;
