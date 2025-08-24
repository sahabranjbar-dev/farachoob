import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import CommentsHeader from "./components/CommentsHeader";
import CommentsList from "./components/CommentsList";

const CommentsTable = () => {
  return (
    <ListContainer url="/comment/all">
      <CommentsHeader />
      <CommentsList />
    </ListContainer>
  );
};

export default CommentsTable;
