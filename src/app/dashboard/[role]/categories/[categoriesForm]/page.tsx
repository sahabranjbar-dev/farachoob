import React from "react";
import CategoriesForm from "../components/CategoriesForm";
import prisma from "@/lib/prisma";

interface ICategoriesFormPage {
  searchParams: Promise<{ pageType: string; id: string }>;
}

const CategoriesFormPage = async ({ searchParams }: ICategoriesFormPage) => {
  const reasolvedSearchParams = await searchParams;
  const { id } = reasolvedSearchParams;

  if (id) {
    const category = await prisma?.category.findUnique({
      where: { id },
    });

    return <CategoriesForm initialData={category ?? undefined} />;
  }
  return <CategoriesForm />;
};

export default CategoriesFormPage;
