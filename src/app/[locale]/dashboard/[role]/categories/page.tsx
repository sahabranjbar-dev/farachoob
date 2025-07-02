import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import CategoriesHeader from "./components/CategoriesHeader";
import CategoriesList from "./components/CategoriesList";

const Categories = () => {
  return (
    <ListContainer url="dashboard/categories">
      <CategoriesHeader />
      <CategoriesList />
    </ListContainer>
  );
};

export default Categories;
