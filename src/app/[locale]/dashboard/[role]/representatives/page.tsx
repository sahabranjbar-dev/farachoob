"use client";

import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import RepresentativesHeader from "./components/RepresentativesHeader";
import RepresentativesList from "./components/RepresentativesList";

const RepresentativesPage = () => {
  return (
    <ListContainer url="dashboard/representatives">
      <RepresentativesHeader />
      <RepresentativesList />
    </ListContainer>
  );
};

export default RepresentativesPage;
