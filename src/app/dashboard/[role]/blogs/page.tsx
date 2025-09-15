import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import BlogsHeader from "./components/BlogsHeader";
import BlogsList from "./components/BlogsList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

const Blogs = () => {
  return (
    <PermissionProvider moduleName="blogs">
      <ListContainer url="/dashboard/blogs">
        <BlogsHeader />
        <BlogsList />
      </ListContainer>
    </PermissionProvider>
  );
};

export default Blogs;
