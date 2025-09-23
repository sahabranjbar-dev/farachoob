import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminDashboardPage from "./(pages)/Admin";
import CustomerDashboardPage from "./(pages)/Customer";
import ManagerDashboardPage from "./(pages)/Manager";

const MainDashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login");
  }

  switch (session.user.role?.englishTitle) {
    case "manager":
      return <ManagerDashboardPage />;
    case "customer":
      return <CustomerDashboardPage />;
    case "admin":
      return <AdminDashboardPage />;
    default:
      return null;
  }
};

export default MainDashboardPage;
