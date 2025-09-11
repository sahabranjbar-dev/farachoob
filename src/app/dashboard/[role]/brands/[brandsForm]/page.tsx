import React from "react";
import BrandForm from "../components/BrandForm";
import prisma from "@/lib/prisma";

interface IBrandFormPage {
  searchParams: Promise<{ pageType: string; id: string }>;
}
const BrandFormPage = async ({ searchParams }: IBrandFormPage) => {
  const reasolvedSearchParams = await searchParams;

  const { id } = reasolvedSearchParams;

  if (id) {
    const brand = await prisma?.brand.findUnique({
      where: { id },
    });
    return <BrandForm initialData={brand ?? undefined} />;
  }
  return <BrandForm />;
};

export default BrandFormPage;
