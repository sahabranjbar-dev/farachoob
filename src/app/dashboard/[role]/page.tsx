import { getServerSession } from "next-auth";
import Manager from "./(pages)/Manager";
import ManagerDashboardPage from "./(pages)/Manager";
import AdminDashboardPage from "./(pages)/Admin";
import UnauthorizedPage from "../unauthorized/page";
import CustomerDashboardPage from "./(pages)/Customer";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const MainDashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
    return;
  }

  switch (session.user.role?.englishTitle) {
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
