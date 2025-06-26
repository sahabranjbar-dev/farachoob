// app/[locale]/dashboard/manager/users/page.tsx
import UsersTable from "@/components/UsersTable";
import ListContainer from "@/container/ListContainer/ListContainer";
import UsersHeader from "./components/UsersHeader";
import UsersList from "./components/UsersList";

export default function UsersPage() {
  return (
    <ListContainer url={`/dashboard/users?page=1&pageSize=10`}>
      <UsersHeader />
      <UsersList />
    </ListContainer>
  );
}
