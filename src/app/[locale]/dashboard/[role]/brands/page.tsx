import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import BrandHeader from "./components/BrandHeader";
import BrandList from "./components/BrandList";

const BrandPage = () => {
  return (
    <ListContainer url="/dashboard/brands">
      <BrandHeader />
      <BrandList />
    </ListContainer>
  );
};

export default BrandPage;
