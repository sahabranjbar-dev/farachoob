import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import ProjectHeader from "./components/ProjectHeader";
import ProjectsList from "./components/ProjectsList";

const ProjectsPage = () => {
  return (
    <ListContainer url="/dashboard/projects">
      <ProjectHeader />
      <ProjectsList />
    </ListContainer>
  );
};

export default ProjectsPage;
