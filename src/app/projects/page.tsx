import prisma from "@/lib/prisma";
import ProjectItems from "./components/ProjectItems";
import { notFound } from "next/navigation";

const ProjectsPageClient = async () => {
  const project = await prisma.project.findMany({
    orderBy: {
      createdAt: "asc",
    },
    take: 10,
  });

  if (!project) return notFound();
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            پروژه‌ها
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            مجموعه‌ای از بهترین کارها و پروژه‌هایی که با تخصص اجرا کرده‌ایم
          </p>
        </header>
        <ProjectItems initalProjects={project} />
      </div>
    </div>
  );
};

export default ProjectsPageClient;
