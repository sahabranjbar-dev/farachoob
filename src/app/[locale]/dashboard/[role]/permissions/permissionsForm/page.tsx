import { notFound } from "next/navigation";
import PermissionForm from "../components/PermissionForm";
import { prisma } from "@/lib/prisma"; // assuming this is how you import Prisma

interface IPermissionFormPage {
  params?: Promise<{}>;
  searchParams?: Promise<{ pageType: string; id: string }>;
}

const PermissionFormPage = async ({
  params,
  searchParams,
}: IPermissionFormPage) => {
  try {
    const resolvedSearchParams = await searchParams;
    const id = resolvedSearchParams?.id;

    if (id) {
      const permission = await prisma.permission.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updateAt: true,
          roles: { select: { role: true, roleId: true } },
        },
      });

      return (
        <PermissionForm
          initialData={{
            description: permission?.description,
            id: permission?.id,
            name: permission?.name,
          }}
        />
      );
    }
    return <PermissionForm />;
  } catch (error) {
    console.error("Error in PermissionFormPage:", error);

    // Optional: Show a custom error UI or fallback
    return (
      <div className="text-red-500 p-4">
        خطایی رخ داده است. لطفاً دوباره تلاش کنید.
      </div>
    );
  }
};

export default PermissionFormPage;
