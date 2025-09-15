import ListContainer from "@/container/ListContainer/ListContainer";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";
import MenusHeader from "./components/MenusHeader";
import MenusList from "./components/MenusList";

export default function MenusPage() {
  return (
    <PermissionProvider moduleName="menus">
      <ListContainer url="dashboard/menus">
        <MenusHeader />
        <MenusList />
      </ListContainer>
    </PermissionProvider>
  );
}
