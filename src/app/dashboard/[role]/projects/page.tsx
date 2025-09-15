import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import ProjectHeader from "./components/ProjectHeader";
import ProjectsList from "./components/ProjectsList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

const ProjectsPage = () => {
  return (
    <PermissionProvider moduleName="projects">
      <ListContainer url="/dashboard/projects">
        <ProjectHeader />
        <ProjectsList />
      </ListContainer>
    </PermissionProvider>
  );
};

export default ProjectsPage;
