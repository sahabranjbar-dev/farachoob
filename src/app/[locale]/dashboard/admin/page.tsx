// app/dashboard/admin/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    // redirect("/unauthorized");
  }

  return (
    <div>
      <h1>داشبورد ادمین</h1>
      {/* محتوای ادمین */}
    </div>
  );
}
