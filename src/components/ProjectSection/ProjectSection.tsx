import ProjectCard from "@/app/projects/components/ProjectCard";
import prisma from "@/lib/prisma";
import React from "react";
import ProjectSectionCard from "./ProjectSectionCard";

const ProjectSection = async () => {
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "asc",
    },
    take: 20,
  });

  if (!projects.length) return null;

  return (
    <div className="text-center mt-2 mb-10 min-h-80">
      <h2 className="font-semibold text-4xl mb-2 text-orange-500">پروژه‌ها</h2>
      <div className="decoration-line mt-8 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent w-1/2 mx-auto"></div>

      <p className="text-lg text-gray-600 dark:text-gray-300 bt-2 mt-2">
        آخرین پروژه‌های فراچوب
      </p>

      <div className="min-h-80 p-4 border m-2 rounded">
        <ProjectSectionCard projects={projects} />
      </div>
    </div>
  );
};

export default ProjectSection;
