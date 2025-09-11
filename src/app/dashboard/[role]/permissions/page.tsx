"use client";

import ListContainer from "@/container/ListContainer/ListContainer";
import PermissionsHeader from "./components/PermissionsHeader";
import PermissionsList from "./components/PermissionsList";

export default function PermissionsPage() {
  return (
    <ListContainer url="dashboard/permissions">
      <PermissionsHeader />
      <PermissionsList />
    </ListContainer>
  );
}
