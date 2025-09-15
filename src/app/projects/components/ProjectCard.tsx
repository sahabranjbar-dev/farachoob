import Image from "next/image";
import Link from "next/link";

interface Props {
  project: any;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl h-[450px] min-h-[450px] max-h-[450px]">
      <div className="relative h-56 w-full">
        <Image
          src={project.images[0] || "/images/placeholder.png"}
          alt={project.title}
          fill
          className="object-cover"
        />
        {project.active || (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            غیرفعال
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col justify-between h-[220px] max-h-[220px] min-h-[220px]">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1 ">
          {project.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-2 min-h-[50px] h-[50] max-h-50">
          {project.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {new Date(project.createdAt).toLocaleDateString("fa-IR")}
          </span>
          <Link
            href={`/projects/${project.id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            مشاهده جزئیات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
