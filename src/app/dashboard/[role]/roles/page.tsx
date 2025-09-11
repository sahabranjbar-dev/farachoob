"use client";
import ListContainer from "@/container/ListContainer/ListContainer";
import RolesHeader from "./components/RolesHeader";
import RolesList from "./components/RolesList";

export default function RolesPage() {
  return (
    <ListContainer url="dashboard/roles">
      <RolesHeader />
      <RolesList />
    </ListContainer>
  );
}
