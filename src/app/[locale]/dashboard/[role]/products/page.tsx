"use client";
import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import ProductsHeader from "./components/ProductsHeader";
import ProductsList from "./components/ProductsList";

const page = () => {
  return (
    <ListContainer url="/dashboard/products">
      <ProductsHeader />
      <ProductsList />
    </ListContainer>
  );
};

export default page;
