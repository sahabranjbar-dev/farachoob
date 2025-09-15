import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import BrandHeader from "./components/BrandHeader";
import BrandList from "./components/BrandList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

const BrandPage = () => {
  return (
    <PermissionProvider moduleName="brands">
      <ListContainer url="/dashboard/brands">
        <BrandHeader />
        <BrandList />
      </ListContainer>
    </PermissionProvider>
  );
};

export default BrandPage;
