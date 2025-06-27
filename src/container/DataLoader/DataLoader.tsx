import React, { cloneElement, PropsWithChildren } from "react";
import { IDataLoader, IDataLoaderOutput } from "./meta/type";

const DataLoader = ({
  data,
  error,
  fetch,
  loading,
  children,
}: PropsWithChildren<IDataLoader>): React.ReactElement | null => {
  if (React.isValidElement(children)) {
    return cloneElement(children as React.ReactElement<any>, {
      data,
      error,
      loading,
      fetch,
    });
  }
  return null;
};

export default DataLoader;
