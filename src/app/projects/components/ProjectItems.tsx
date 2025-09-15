"use client";
import React, { useEffect, useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import Spinner from "@/components/Spinner";
import useDataGetter from "@/hooks/useDataGetter";

interface Props {
  initalProjects: any[];
}

const ProjectItems = ({ initalProjects }: Props) => {
  const [projects, setProjects] = useState<any[]>(initalProjects);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { error, fetch, loading } = useDataGetter({
    url: "/projects",
    onSuccess(data) {
      const newProjects = data?.projects ?? [];
      const totalItems = data?.totalItems ?? 0;

      setProjects((prev) => {
        if (
          !newProjects.length ||
          prev.length + newProjects.length >= totalItems
        ) {
          setHasMore(false);
        }
        return [...prev, ...newProjects];
      });
    },
    immediatelyFetch: false,
  });

  useEffect(() => {
    if (page === 1) return;
    fetch?.({
      inputParams: {
        page,
        pageSize: 10,
      },
    });
  }, [page, fetch]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {hasMore && <div ref={loaderRef} className="h-20 mt-4"></div>}
      {loading && (
        <div className="mt-2 mb-10">
          <Spinner />
        </div>
      )}
      {error && (
        <p className="text-red-500 mt-4">مشکلی در دریافت پروژه‌ها رخ داد.</p>
      )}
    </>
  );
};

export default ProjectItems;
