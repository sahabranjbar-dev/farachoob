"use client";

import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import BlogsHeader from "./components/BlogsHeader";
import BlogsList from "./components/BlogsList";

const Blogs = () => {
  return (
    <ListContainer url="/dashboard/blogs">
      <BlogsHeader />
      <BlogsList />
    </ListContainer>
  );
};

export default Blogs;
