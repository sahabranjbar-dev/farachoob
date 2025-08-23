import { redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth";
import Manager from "./(pages)/Manager";
import { getLocale } from "next-intl/server";
import ManagerDashboardPage from "./(pages)/Manager";
import AdminDashboardPage from "./(pages)/Admin";
import UnauthorizedPage from "../unauthorized/page";
import CustomerDashboardPage from "./(pages)/Customer";
import { authOptions } from "@/lib/auth";

const MainDashboardPage = async ({
  params,
}: {
  params: Promise<{ role: string }>;
}) => {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  if (!session) {
    redirect({
      href: "/auth/login",
      locale,
    });
    return;
  }

  switch (session.user.role) {
    case "manager":
      return <ManagerDashboardPage />;
    case "customer":
      return <CustomerDashboardPage />;
    case "admin":
      return <AdminDashboardPage />;
    default:
      return <UnauthorizedPage />;
  }
};

export default MainDashboardPage;
