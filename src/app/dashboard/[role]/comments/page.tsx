import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import CommentsHeader from "./components/CommentsHeader";
import CommentsList from "./components/CommentsList";
import PermissionProvider from "@/container/PermissionProvider/PermissionProvider";

const CommentsTable = () => {
  return (
    <PermissionProvider moduleName="comments">
      <ListContainer url="/comment/all">
        <CommentsHeader />
        <CommentsList />
      </ListContainer>
    </PermissionProvider>
  );
};

export default CommentsTable;
