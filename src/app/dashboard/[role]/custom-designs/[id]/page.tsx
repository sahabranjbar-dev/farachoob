import React from "react";
import CustomDesignForm from "../components/CustomDesignForm";
import prisma from "@/lib/prisma";

interface Props {
  searchParams: Promise<{ pageType: string; id: string }>;
  params: Promise<any>;
}

const CustomDesignPage = async ({ params, searchParams }: Props) => {
  const reasolvedParams = await params;
  const { id } = reasolvedParams;

  if (id) {
    const CustomDesign = await prisma?.customDesignRequest.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    return <CustomDesignForm initialData={CustomDesign ?? undefined} />;
  }
  return <CustomDesignForm />;
};

export default CustomDesignPage;
