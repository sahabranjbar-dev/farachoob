"use client";
import ListContainer from "@/container/ListContainer/ListContainer";
import UsersHeader from "./components/UsersHeader";
import UsersList from "./components/UsersList";

export default function UsersPage() {
  return (
    <ListContainer url="/dashboard/users">
      <UsersHeader />
      <UsersList />
    </ListContainer>
  );
}
