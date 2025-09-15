import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import ProductsHeader from "./components/ProductsHeader";
import ProductsList from "./components/ProductsList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

const page = () => {
  return (
    <PermissionProvider moduleName="products">
      <ListContainer url="/dashboard/products">
        <ProductsHeader />
        <ProductsList />
      </ListContainer>
    </PermissionProvider>
  );
};

export default page;
