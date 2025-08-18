import RoleForm from "@/components/RoleForm";
import React from "react";
interface IRolesFormPage {
  params: Promise<any>;
  searchParams: Promise<{ pageType: string; id: string }>;
}
const RolesFormPage = async ({ params, searchParams }: IRolesFormPage) => {
  const resolvedSearchParams = await searchParams;
  const { id } = resolvedSearchParams;

  if (id) {
    const role = await prisma?.role.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        farsiTitle: true,
        englishTitle: true,
        description: true,
        createdAt: true,
        status: true,
        updateAt: true,
        users: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        permissions: {
          select: {
            id: true,
            permission: true,
            permissionId: true,
          },
        },
      },
    });

    // Convert nulls to undefined to match Partial<FormValues>
    const convertNullsToUndefined = (obj: any): any => {
      if (obj === null) return undefined;
      if (Array.isArray(obj)) return obj.map(convertNullsToUndefined);
      if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [k, convertNullsToUndefined(v)])
        );
      }
      return obj;
    };

    return (
      <RoleForm initialData={convertNullsToUndefined(role) ?? undefined} />
    );
  }
};

export default RolesFormPage;
