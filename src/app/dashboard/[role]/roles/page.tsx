import ListContainer from "@/container/ListContainer/ListContainer";
import RolesHeader from "./components/RolesHeader";
import RolesList from "./components/RolesList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

export default function RolesPage() {
  return (
    <PermissionProvider moduleName="roles">
      <ListContainer url="dashboard/roles">
        <RolesHeader />
        <RolesList />
      </ListContainer>
    </PermissionProvider>
  );
}
