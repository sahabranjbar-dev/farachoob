import ListContainer from "@/container/ListContainer/ListContainer";
import UsersHeader from "./components/UsersHeader";
import UsersList from "./components/UsersList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

export default function UsersPage() {
  return (
    <PermissionProvider moduleName="settings">
      <ListContainer url="/dashboard/users">
        <UsersHeader />
        <UsersList />
      </ListContainer>
    </PermissionProvider>
  );
}
