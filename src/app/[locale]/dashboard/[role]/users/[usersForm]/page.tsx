import React from "react";
import UserForm from "../components/UserForm";

interface IUserFormPage {
  params: Promise<any>;
  searchParams: Promise<{ pageType: string; id: string }>;
}

const UserFormPage = async ({ params, searchParams }: IUserFormPage) => {
  const resolvedSearchParams = await searchParams;

  const { id } = resolvedSearchParams;
  if (id) {
    const user = await prisma?.user.findUnique({
      where: {
        id,
      },
    });
    return <UserForm initialData={user} />;
  } else return <UserForm />;
};

export default UserFormPage;
