"use client";

import { PropsWithChildren, useContext } from "react";
import { IListContainer } from "./meta/type";
import { ListContainerContext } from "./context/ListContainerContext";
import useDataGetter from "@/hooks/useDataGetter";

const ListContainer = ({
  children,
  url,
  body,
  params,
}: PropsWithChildren<IListContainer>) => {
  const { data, error, fetch, loading } = useDataGetter({
    url,
    body,
    params,
  });
  return (
    <ListContainerContext.Provider
      value={{
        data,
        error,
        loading,
        fetch: (args = {}) => fetch?.(args),
      }}
    >
      {children}
    </ListContainerContext.Provider>
  );
};

export const useList = () => {
  const context = useContext(ListContainerContext);
  if (!context) throw new Error("useList must be used within ListContainer");
  return context;
};
export default ListContainer;
