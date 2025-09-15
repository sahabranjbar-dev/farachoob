import prisma from "@/lib/prisma";
import React from "react";
import MenusFormPage from "../components/Menusform";

interface Props {
  searchParams: Promise<{ pageType: string; id: string }>;
}

const MenusPage = async ({ searchParams }: Props) => {
  const reasolvedSearchParams = await searchParams;

  const { id } = reasolvedSearchParams;

  if (id) {
    const initialData = await prisma?.menu.findUnique({
      where: { id },
    });
    return <MenusFormPage initialData={initialData} />;
  }
  return <MenusFormPage />;
};

export default MenusPage;
