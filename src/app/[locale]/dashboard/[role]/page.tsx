import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth";

const MainDashboardPage = async ({
  params,
}: {
  params: Promise<{ role: string }>;
}) => {
  const session = await getServerSession(authOptions);

  const role = (await params).role;

  if (role === "unauthorized") {
    redirect({
      href: "/auth/login",
      locale: "fa",
    });
    return;
  }

  if (role !== "unauthorized" && session?.user.role !== role) {
    redirect({
      href: "/dashboard/unauthorized",
      // TODO: change locale
      locale: "fa",
    });
  }
  return <div>{role}</div>;
};

export default MainDashboardPage;
