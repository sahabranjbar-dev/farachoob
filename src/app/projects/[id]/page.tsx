import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProjectSlider from "../components/ProjectSlider";

interface Props {
  params: Promise<{ id: string }>;
}

const ProjectDetailPage = async ({ params }: Props) => {
  const resolvedParams = await params;

  const id = resolvedParams.id;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className=" mx-auto px-4">
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <header className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {project?.title}
                </h1>
                {project?.active || (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    غیرفعال
                  </span>
                )}
              </div>

              <div className="flex items-center text-gray-500 text-sm">
                <span>
                  تاریخ ایجاد:{" "}
                  {new Date(project?.createdAt).toLocaleDateString("fa-IR")}
                </span>
                {project?.createdAt !== project?.updateAt && (
                  <span className="mr-6">
                    آخرین بروزرسانی:{" "}
                    {new Date(project?.updateAt).toLocaleDateString("fa-IR")}
                  </span>
                )}
              </div>
            </header>

            <div className="mx-auto container mb-8 text-gray-700">
              <p className="text-justify">{project?.description}</p>
            </div>

            <div className="h-80 md:h-[400px] lg:h-[600px] w-full border p-4 m-2 rounded-2xl">
              <ProjectSlider images={project?.images} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
