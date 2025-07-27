import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth";
import Manager from "./(pages)/Manager";

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
  switch (role) {
    case "manager":
      return <Manager />;
    case "admin":
      return <div>Admin Dashboard</div>;

    case "user":
      return <div>User Dashboard</div>;

    default:
      return <div>Unauthorized</div>;
  }
};

export default MainDashboardPage;
