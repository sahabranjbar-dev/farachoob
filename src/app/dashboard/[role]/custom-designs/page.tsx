import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import CustomDesignHeader from "./components/CustomDesignHeader";
import CustomDesignList from "./components/CustomDesignList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

const CustomDesignsPage = () => {
  return (
    <PermissionProvider moduleName="custom_design">
      <ListContainer url="/dashboard/custom-designs">
        <CustomDesignHeader />
        <CustomDesignList />
      </ListContainer>
    </PermissionProvider>
  );
};

export default CustomDesignsPage;
