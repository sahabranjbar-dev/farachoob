import prisma from "@/lib/prisma";
import React from "react";
import ProjectsForm from "../components/ProjectsForm";

interface Props {
  searchParams: Promise<{ id: string }>;
}

const ProjectsFormPage = async ({ searchParams }: Props) => {
  const resolvedParams = await searchParams;

  const id = resolvedParams?.id;

  if (id) {
    const initialData = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    return <ProjectsForm initialData={initialData} />;
  }

  return <ProjectsForm />;
};

export default ProjectsFormPage;
