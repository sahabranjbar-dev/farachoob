"use client";

import ListContainer from "@/container/ListContainer/ListContainer";
import MenusHeader from "./components/MenusHeader";
import MenusList from "./components/MenusList";

export default function MenusPage() {
  return (
    <ListContainer url="dashboard/menus">
      <MenusHeader />
      <MenusList />
    </ListContainer>
  );
}
