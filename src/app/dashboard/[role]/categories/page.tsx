import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import CategoriesHeader from "./components/CategoriesHeader";
import CategoriesList from "./components/CategoriesList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

const Categories = () => {
  return (
    <PermissionProvider moduleName="categories">
      <ListContainer url="dashboard/categories">
        <CategoriesHeader />
        <CategoriesList />
      </ListContainer>
    </PermissionProvider>
  );
};

export default Categories;
