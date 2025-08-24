import React from "react";
import UserForm from "../components/UserForm";

interface IUserFormPage {
  params: Promise<any>;
  searchParams: Promise<{ pageType: string; id: string }>;
}

const UserFormPage = async ({ params, searchParams }: IUserFormPage) => {
  const resolvedSearchParams = await searchParams;
  const rawRoles = await prisma?.role.findMany({
    select: {
      id: true,
      farsiTitle: true,
      englishTitle: true,
    },
  });
  const roles =
    rawRoles?.map((role) => ({
      id: role.id,
      farsiTitle: role.farsiTitle ?? "",
      englishTitle: role.englishTitle ?? "",
    })) ?? [];
  const { id } = resolvedSearchParams;
  if (id) {
    const user = await prisma?.user.findUnique({
      where: {
        id,
      },
      select: {
        birthDate: true,
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        image: true,
        lastName: true,
        mobile: true,
        role: {
          select: {
            id: true,
            farsiTitle: true,
            englishTitle: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    title: true,
                    permissionKey: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return <UserForm initialData={user} roles={roles} />;
  } else return <UserForm roles={roles} />;
};

export default UserFormPage;
