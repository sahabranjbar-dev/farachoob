import ListContainer from "@/container/ListContainer/ListContainer";
import PermissionsHeader from "./components/PermissionsHeader";
import PermissionsList from "./components/PermissionsList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

export default function PermissionsPage() {
  return (
    <PermissionProvider moduleName="permissions">
      <ListContainer url="dashboard/permissions">
        <PermissionsHeader />
        <PermissionsList />
      </ListContainer>
    </PermissionProvider>
  );
}
