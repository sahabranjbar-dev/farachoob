import ListHeader from "@/components/ListHeader/ListHeader";
import UserFilter from "@/components/UserFilter";
import React from "react";

const MenusHeader = () => {
  return <ListHeader filter={<UserFilter />} title="فرم ایجاد منو" />;
};

export default MenusHeader;
